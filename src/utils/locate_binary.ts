import * as path from "path";
import * as process from 'process';
import {ExtensionContext, workspace} from "vscode";
import {LanguageClient, LanguageClientOptions, ServerOptions, TransportKind} from "vscode-languageclient/node";
import { getApi, FileDownloader } from '@microsoft/vscode-file-downloader-api';

export function DownloadAndLoacateLSPBinary(ctx: ExtensionContext) {
    let os = process.platform; // get user operating system
    let arch = process.arch; // get user architecture

    let serverPath = ctx.asAbsolutePath(
        path.join("bin", "")
    );
}