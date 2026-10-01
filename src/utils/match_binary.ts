import * as process from 'process';
import { window } from 'vscode';
import { traceChannel } from '../extension';

export async function MatchBinary(): Promise<string | undefined> {
    let os: string = '';
    let arch: string = '';

    traceChannel.info("[Extension] Determine suitable MetaCall-lsp binary for user device");

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
        traceChannel.error(`[Extension] Error occured while determining user OS.`);
        return;
    } else if (!arch) {
        traceChannel.error(`[Extension] Error occured while determining user machine architecture.`);
        return;
    }

    const match: string = `${arch}-${os}`;
    traceChannel.info(`[Extension] Determined suitable MetaCall-lsp binary as: ${match}`);
    return match;
}