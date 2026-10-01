import { getApi, FileDownloader } from '@microsoft/vscode-file-downloader-api';
import {ExtensionContext} from "vscode";
import * as vscode from 'vscode';
import { traceChannel } from '../extension';

type GitBinary = {
    name: string,
    browser_download_url: string
}
export type GitBinaryItem = {
    name: string,
    downloadURL: string
}

export let binaries: GitBinaryItem[] = [];

export async function DownloadBinary(ctx: ExtensionContext, name: string) {
    let binary: GitBinaryItem | undefined;
    let downloadedBinary: vscode.Uri = vscode.Uri.parse('');
    let githubBinaries = binaries;
    
    try {
        traceChannel.info("[Extension] Downloading MetaCall-lsp binary");
        binary = githubBinaries.find((item: GitBinaryItem) => {
            const isArchive = item.name.endsWith('.tar.gz') || item.name.endsWith('.zip');
            const isChecksum = item.name.endsWith('.sha256');

            return item.name.includes(name) && isArchive && !isChecksum;
        });

        if (!binary) {
            throw new Error(`No downloadable archive found for ${name}`);
        }

        const fileDownloader: FileDownloader = await getApi();
    
        downloadedBinary = await fileDownloader.downloadFile(
            vscode.Uri.parse(binary.downloadURL),
            binary.name,
            ctx
        );

	    traceChannel.info("[Extension] Trace channel created");
    } catch(err) {
        traceChannel.error(`[Extension] Error occured while downloading MetaCall-lsp binary. error: ${err}`);
    }

    return downloadedBinary.fsPath;
}

export async function GetLSPBinariesData() {

    const url: string = 'https://api.github.com/repos/metacall/lsp/releases/latest';
    try {
        traceChannel.info("[Extension] Fetch github MetaCall-lsp binaries data");
        const res: Response = await fetch(url,
            {
                headers: { 'User-Agent': 'vscode-extension' }
            }
        );

        if (!res.ok) {
            throw new Error("Failed to fetch github MetaCall-lsp binaries data");
        }

        const data: any = await res.json();

        binaries = data.assets.map((asset: GitBinary) => {
            let item: GitBinaryItem = {
                name: asset.name,
                downloadURL: asset.browser_download_url
            };
    
            return item;
        });
        traceChannel.info("[Extension] Fetched github MetaCall-lsp binaries data");
    } catch(err) {
        traceChannel.error(`[Extension] Error occured while fetching MetaCall-lsp binaries. error: ${err}`);
    }
}