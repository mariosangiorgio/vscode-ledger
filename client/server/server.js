'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_languageserver_2 = require("vscode-languageserver");
const ledger_cli_1 = require("ledger-cli");
const url = require("url");
let binary;
let accounts = new Set([]);
let payees = new Set([]);
let connection = vscode_languageserver_1.createConnection(new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process));
connection.onDidChangeConfiguration((change) => {
    let settings = change.settings;
    binary = settings.ledger.binary || "/usr/local/bin/ledger";
});
// Returns the line of the document that contains the specified position
function getFullLine(document, position) {
    let nextLinePosition = { character: 0, line: position.line + 1 };
    let lineOffset = document.offsetAt(position) - position.character;
    let nextLineOffset = document.offsetAt(nextLinePosition);
    return document.getText().substring(lineOffset, nextLineOffset);
}
// Heuristic to decide whether we're dealing with the fist
// line of a transaction (it starts with a date) or with
// the lines including the amount associated to a given account.
// It expects the user to have already inserted the date before
// invoking auto-completion.
function isTransactionHeader(line) {
    return /^\d+/.test(line.trim());
}
function generateAccountCompletions() {
    let result = [];
    accounts.forEach((account, index) => {
        result.push({
            label: account,
            kind: vscode_languageserver_2.CompletionItemKind.Text,
            data: index
        });
    });
    return result;
}
function generatePayeeCompletions() {
    let result = [];
    payees.forEach((payee, index) => {
        result.push({
            label: payee,
            kind: vscode_languageserver_2.CompletionItemKind.Text,
            data: index
        });
    });
    return result;
}
connection.onCompletion((textDocumentPosition) => {
    let document = documents.get(textDocumentPosition.textDocument.uri);
    let position = textDocumentPosition.position;
    let currentLine = getFullLine(document, position);
    return isTransactionHeader(currentLine) ? generatePayeeCompletions() : generateAccountCompletions();
});
let documents = new vscode_languageserver_1.TextDocuments();
function pathToFile(document) {
    return decodeURI(url.parse(document.uri).path);
}
function refresh(file) {
    let ledger = new ledger_cli_1.Ledger({ binary: binary, file: file });
    ledger.stats((err, stat) => {
        if (err) {
            connection.window.showErrorMessage(err);
        }
        else {
            // two passes. .once('error', error =>{}) doesn't seem to be ever called
            ledger.register()
                .on('data', entry => {
                payees.add(entry.payee);
                entry.postings.map(posting => accounts.add(posting.account));
            });
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
    if (params.document.uri.startsWith("file://")) {
        let file = pathToFile(params.document);
        refresh(file);
    }
});
documents.onDidSave((change) => {
    let file = pathToFile(change.document);
    refresh(file);
});
documents.listen(connection);
connection.onInitialize((params) => {
    return {
        capabilities: {
            //TODO: evaluate if this should be done incrementally
            textDocumentSync: documents.syncKind,
            completionProvider: {
                resolveProvider: false
            }
        }
    };
});
connection.listen();
//# sourceMappingURL=server.js.map