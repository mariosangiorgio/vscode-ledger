'use strict';
import { workspace, Disposable, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, TransportKind } from 'vscode-languageclient';
import * as path from 'path';

export function activate(context: ExtensionContext) {
	let serverModule = context.asAbsolutePath(path.join('out', 'server.js'));
	let debugOptions = { execArgv: ["--nolazy", "--debug=6004"] };	
	let serverOptions: ServerOptions = {
		run : { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	}	
	let clientOptions: LanguageClientOptions = {
		documentSelector: ['ledger'],
		synchronize: {
			configurationSection: 'ledger',
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	}

	let client = new LanguageClient('Ledger', serverOptions, clientOptions).start();	
	context.subscriptions.push(client);
}