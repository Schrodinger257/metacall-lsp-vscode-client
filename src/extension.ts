// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MatchBinary } from './utils/match_binary';
import { DownloadBinary } from './utils/download_binary';
import { ExtractLSPArchive, LoacateLSPBinary } from './utils/local_binary_actions';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	let id: string | undefined = vscode.window.activeTextEditor?.document.languageId;
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

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.window.onDidChangeActiveTextEditor(editor => {
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
