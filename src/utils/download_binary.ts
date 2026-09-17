import { getApi, FileDownloader } from '@microsoft/vscode-file-downloader-api';
import {ExtensionContext, workspace} from "vscode";
import * as vscode from 'vscode';

type GitBinary = {
    name: string,
    browser_download_url: string
}
type GitBinaryItem = {
    name: string,
    downloadURL: string
}

export async function DownloadBinary(ctx: ExtensionContext, name: string) {
    const binaries: Promise<GitBinaryItem[]> = GetLSPBinariesData();
    let binary: GitBinaryItem[] = [];
    let downloadedBinary: vscode.Uri = vscode.Uri.parse('');

    try {
        binary = (await binaries).filter((item: GitBinaryItem) => {
            if (item.name.includes(name)) {
                return item;
            }
        });

        const fileDownloader: FileDownloader = await getApi();
    
        downloadedBinary = await fileDownloader.downloadFile(
            vscode.Uri.parse(binary[0].downloadURL),
            binary[0].name,
            ctx
        );
    } catch(err) {
        vscode.window.showErrorMessage(`${err}`);
    }
    
    return downloadedBinary.fsPath;
}

async function GetLSPBinariesData() {
    let binaries: GitBinaryItem[] = [];

    const url: string = 'https://api.github.com/repos/metacall/lsp/releases/latest';
    try {
        const res: Response = await fetch(url,
            {
                headers: { 'User-Agent': 'vscode-extension' }
            }
        );

        const data: any = await res.json();

        binaries = data.assets.map((asset: GitBinary) => {
            let item: GitBinaryItem = {
                name: asset.name,
                downloadURL: asset.browser_download_url
            };
    
            return item;
        });
    } catch(err) {
        vscode.window.showErrorMessage(`${err}`);
    }
    
    return binaries;
}