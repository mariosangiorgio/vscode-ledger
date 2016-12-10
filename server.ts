'use strict';
import {IPCMessageReader, IPCMessageWriter, createConnection, IConnection, TextDocument, TextDocumentSyncKind, TextDocuments, Diagnostic, DiagnosticSeverity, InitializeParams, InitializeResult} from 'vscode-languageserver';
import {CompletionItem, CompletionItemKind, TextDocumentPositionParams} from 'vscode-languageserver';
import {Ledger} from 'ledger-cli';
import * as url from 'url';

let binary: string;
let accounts : Set<string> = new Set<string>([]);
let payees : Set<string> = new Set<string>([]);

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

connection.onCompletion((textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
    let result = []
    accounts.forEach((account, index) => {
        result.push({
            label: account,
            kind: CompletionItemKind.Text,
            data: index
        })
    })
    payees.forEach((payee, index) => {
        result.push({
            label: payee,
            kind: CompletionItemKind.Text,
            data: index
        })
    })
    return result
});

let documents: TextDocuments = new TextDocuments();

function pathToFile(document){
    return decodeURI(url.parse(document.uri).path)
}

function refresh(file){
    let ledger = new Ledger({ binary: binary, file: file });
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
        }
    });
}

documents.onDidOpen(params => {
    let file = pathToFile(params.document)
    refresh(file)
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