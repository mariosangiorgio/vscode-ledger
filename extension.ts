import * as vscode from 'vscode';
import {Ledger} from 'ledger-cli';

function validate(document: vscode.TextDocument){
    let ledger = new Ledger({ file: document.fileName });
    ledger.stats((err, stat) => console.log(err, stat));
}

export function activate(ctx: vscode.ExtensionContext) {
    ctx.subscriptions.push(vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
        validate(document);
    }));
}
