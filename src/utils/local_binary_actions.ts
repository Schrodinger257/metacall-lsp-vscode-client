import * as path from "path";
import {ExtensionContext} from "vscode";
import { readFile } from 'fs/promises';
import * as vscode from 'vscode';
import { extract } from 'dir-archiver';
import * as tar from 'tar';
import { binaries, GitBinaryItem } from "./download_binary";
import { traceChannel } from "../extension";

export async function LoacateLSPBinary(ctx: ExtensionContext) {
    // path of metacall lsp archive
    const locatePath: vscode.Uri = vscode.Uri.parse(path.join(ctx.globalStorageUri.fsPath , 'file-downloader-downloads'));
    let isBinaryLocated: boolean = false;
    let archiveGot: string = '';
    // search and locate lsp binary
    try {
        traceChannel.info("[Extension] Locating MetaCall-lsp binary");
        let githubBinaries = binaries;
        const entriesGot = await vscode.workspace.fs.readDirectory(locatePath);
        
        const binaryEntriesFound = entriesGot.filter(([name, type]) =>
            type === vscode.FileType.File && name === 'meta-call-lsp'
        );
        
        if (binaryEntriesFound.length > 0) {
            traceChannel.info("[Extension] Located MetaCall-lsp binary");
            isBinaryLocated = true;
        }

        traceChannel.info("[Extension] Determine MetaCall-lsp binary version");

        const archiveEntriesFound = entriesGot.filter(([name, type]) => {
            if (type === vscode.FileType.File && (/^meta-call-lsp.*\.zip$/.test(name) || /^meta-call-lsp.*\.tar\.gz$/.test(name))) {
                const found: GitBinaryItem | undefined = githubBinaries.find((b) => b.name === name);
                if (found) {
                    archiveGot = name;
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        });

        if (archiveEntriesFound.length === 0 && !archiveGot) {
            traceChannel.warn("[Extension] MetaCall-lsp binary version is old. Getting ready to download Latest one");
            isBinaryLocated = false;
        } else {
            traceChannel.info("[Extension] MetaCall-lsp binary is the latest version");
        }
        
        return isBinaryLocated;
    } catch(err) {
        traceChannel.error(`[Extension] Error occured while locating MetaCall-lsp binary. error: ${err}`);
    }

    return isBinaryLocated;
}

export async function ExtractLSPArchive(archive: string) {
    const dest: string = path.dirname(archive);

    try {
        traceChannel.info("[Extension] Extract MetaCall-lsp binary archive");
        if (archive.endsWith('.zip')) {
            await extract(archive, dest);
            traceChannel.info("[Extension] Extracted MetaCall-lsp binary archive");
            return;
        }

        if (archive.endsWith('.tar.gz') || archive.endsWith('.tgz')) {
            await tar.x({
                file: archive,
                cwd: dest,
                strip: 1, // extract contents in the same folder
            });
            traceChannel.info("[Extension] Extracted MetaCall-lsp binary archive");
            return;
        }
    } catch(err) {
        traceChannel.error(`[Extension] Error occured while extracting MetaCall-lsp binary archive. error: ${err}`);
    }
}