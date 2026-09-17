// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MatchBinary } from './utils/match_binary';
import { DownloadBinary } from './utils/download_binary';
import { ExtractLSPArchive, LoacateLSPBinary } from './utils/local_binary_actions';
import path from 'path';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient | undefined;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	let allowedIds: string[] = ["python", "javascript", "typescript", "c", "rust", "cpp"];
	let isBinaryLocated: boolean = false;
	// get system lsp binary pattern
	const pattern: string | undefined = await MatchBinary();
	if (pattern) {
		// determine is binary downloaded or not
		isBinaryLocated = await LoacateLSPBinary(context, pattern);

	}
	
	if (!isBinaryLocated && pattern) {
		const downloadPath: string = await DownloadBinary(context, pattern);
		await ExtractLSPArchive(downloadPath);
	}
	const lspBinary: string = path.join(context.globalStorageUri.fsPath, 'file-downloader-downloads', 'meta-call-lsp');

	const lspOptions: ServerOptions = {
		run: {
			command: lspBinary,
			transport: TransportKind.stdio,
		},
		debug: {
			command: lspBinary,
			transport: TransportKind.stdio,
		},
	};

	const clientOptions: LanguageClientOptions = {
		documentSelector: allowedIds.map((id) => {return {scheme: 'file', language: id};}),
		synchronize: {
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	client = new LanguageClient(
		'MetaCall-lsp',
		'lsp server for MetaCall',
		lspOptions,
		clientOptions
	);

	await client.start();
}

// This method is called when your extension is deactivated
export async function deactivate() {
	await client?.dispose();
	client = undefined;
}
