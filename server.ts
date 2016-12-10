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