'use strict';
import {IPCMessageReader, IPCMessageWriter, createConnection, IConnection, TextDocument, TextDocuments, Diagnostic, DiagnosticSeverity, InitializeParams, InitializeResult, NotificationType} from 'vscode-languageserver';
import {Ledger} from 'ledger-cli';
import * as url from 'url';

let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));
let documents: TextDocuments = new TextDocuments();

documents.onDidChangeContent((change) =>{
    connection.console.info("Content changed")
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

documents.onDidSave((change) => {
    let ledger = new Ledger({ file: decodeURI(url.parse(change.document.uri).path) });
    ledger.stats((err, stat) => {
        if(err){
            connection.window.showErrorMessage(err)  
        }
    });
});

documents.listen(connection);
let workspaceRoot: string;
connection.onInitialize((params): InitializeResult => {
	workspaceRoot = params.rootPath;
	return {
		capabilities: {
			textDocumentSync: documents.syncKind
			}
		}
});

connection.listen();