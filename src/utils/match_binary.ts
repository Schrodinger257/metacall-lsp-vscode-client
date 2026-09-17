import * as process from 'process';
import { window } from 'vscode';

export async function MatchBinary(): Promise<string | undefined> {
    let os: string = '';
    let arch: string = '';

    switch (process.platform) {
        case 'win32':
            os = 'windows';
            break;
        case 'linux':
            os = 'unknown-linux';
            break;
        case 'darwin':
            os = 'apple-darwin';
            break;
        default:
            os = '';
    }

    switch (process.arch) {
        case 'arm64':
            arch = 'aarch64';
            break;
        case 'x64':
            arch = 'x86_64';
            break;
        default:
            arch = '';
    }

    if (!os) {
        window.showErrorMessage('Failed to determine OS for MetaCall-lsp');
        return;
    } else if (!arch) {
        window.showErrorMessage('Failed to determine Architecture for MetaCall-lsp');
        return;
    }

    const match = `${arch}-${os}`;
    window.showInformationMessage('MetaCall-lsp download match: ' + match);
    console.log(match);
    return match;
}