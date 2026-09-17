import { getApi, FileDownloader } from '@microsoft/vscode-file-downloader-api';
import {ExtensionContext, workspace} from "vscode";
import * as path from "path";

export async function DownloadBinary(ctx: ExtensionContext, name: string) {
    const fileDownloader: FileDownloader = await getApi();

}