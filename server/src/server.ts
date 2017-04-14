'use strict';
import {IPCMessageReader, IPCMessageWriter, createConnection, IConnection, TextDocument, TextDocumentSyncKind, TextDocuments, Diagnostic, DiagnosticSeverity, InitializeParams, InitializeResult} from 'vscode-languageserver';
import {CompletionItem, CompletionItemKind, TextDocumentPositionParams} from 'vscode-languageserver';
import {Ledger} from 'ledger-cli';
import * as url from 'url';
import {CompletionOracle} from './autocomplete';

let binary: string;
// Default value for when the file hasn't been loaded yet
let completionOracle = new CompletionOracle(new Set<string>(), new Set<string>());

let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

interface LedgerSettings{
    binary: string
}
interface Settings {
    ledger: LedgerSettings;
}

connection.onDidChangeConfiguration((change) => {
    let settings = <Settings>change.settings;
    binary = settings.ledger.binary || "/usr/local/bin/ledger";
});

// Returns the line of the document that contains the specified position
function getFullLine(document, position): string {
    let nextLinePosition = {character: 0, line: position.line + 1};
    let lineOffset = document.offsetAt(position) - position.character;
    let nextLineOffset = document.offsetAt(nextLinePosition);
    return document.getText().substring(lineOffset, nextLineOffset);
}

connection.onCompletion((textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
    let document = documents.get(textDocumentPosition.textDocument.uri);
    let position = textDocumentPosition.position;
    let currentLine = getFullLine(document, position);
    let completions =  completionOracle.complete(currentLine);
    let result = [];
    completions.forEach((completion, index) => {
        result.push({
            label: completion.label,
            insertText: completion.insertText,
            kind: CompletionItemKind.Text,
            data: index
        })
    });
    return result;
});

let documents: TextDocuments = new TextDocuments();

function pathToFile(document){
    return decodeURI(url.parse(document.uri).path)
}

function refresh(file){
    let ledger = new Ledger({ binary: binary, file: file });
    let payees = new Set<string>();
    let accounts = new Set<string>();
    ledger.stats((err, stat) => {
        if(err){
            connection.window.showErrorMessage(err)
        }
        else{
            // two passes. .once('error', error =>{}) doesn't seem to be ever called
            ledger.register()
                    .on('data', entry => {
                        payees.add(entry.payee)
                        entry.postings.map(posting => accounts.add(posting.account))
                    })
                    .on('end', () => completionOracle = new CompletionOracle(accounts, payees))
        }
    });
}

documents.onDidOpen(params => {
    // Sometimes we don't have real files
    // An example is git diffs. They compare an actual file
    // with an in memory representation of the latest committed
    // file. They have an inmemory:// uri schema.
    // The ledger binary can only point to actual files so the best
    // we can do here is to skip validation for the old version
    if(params.document.uri.startsWith("file://")){
        let file = pathToFile(params.document)
        refresh(file)
    }
})

documents.onDidSave((change) => {
    let file = pathToFile(change.document)
    refresh(file)
});

documents.listen(connection);

connection.onInitialize((params): InitializeResult => {
	return {
		capabilities: {
            //TODO: evaluate if this should be done incrementally
            textDocumentSync: documents.syncKind,
            completionProvider: {
                resolveProvider: false
            }
        }
    }
});

connection.listen();
