'use strict';
import {IPCMessageReader, IPCMessageWriter, createConnection, IConnection, TextDocument, TextDocumentSyncKind, TextDocuments, Diagnostic, DiagnosticSeverity, InitializeParams, InitializeResult} from 'vscode-languageserver';
import {CompletionItem, CompletionItemKind, TextDocumentPositionParams} from 'vscode-languageserver';
import {Ledger} from 'ledger-cli';
import * as url from 'url';

let accounts : string[] = [];

let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

connection.onCompletion((textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
    return accounts.map((account, index) => {
        return {
            label: account,
            kind: CompletionItemKind.Text,
            data: index
        }
    })
});

let documents: TextDocuments = new TextDocuments();
documents.onDidChangeContent((change) =>{
    connection.console.info("Content changed")
    connection.console.info(change.document.getText())
    //TODO: ditch ledger-cli so issues can be reported in real time
    let diagnostics: Diagnostic[] = [];
    /*
    diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
            start: { line: 0, character: 0 },
            end: { line: 10, character: 10 }
        },                
        message: err,
        source: 'ledger'
    });
    connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
    */
})

documents.onDidOpen(params => {
    let ledger = new Ledger({ file: decodeURI(url.parse(params.document.uri).path) });
    ledger.accounts().on('data', account => accounts.push(account))
})

documents.onDidSave((change) => {
    let ledger = new Ledger({ file: decodeURI(url.parse(change.document.uri).path) });
    ledger.stats((err, stat) => {
        if(err){
            connection.window.showErrorMessage(err)  
        }
    });
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