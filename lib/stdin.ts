import * as fs from 'fs';
import { StdIO } from './constants';

export async function readFileOrStdin(filePath: string, encoding: BufferEncoding): Promise<string> {
    if (filePath === StdIO.In) {
        return await readStdinSync(encoding);
    } else {
        return Promise.resolve(fs.readFileSync(filePath, encoding));
    }
}

export function readStdinSync(encoding: BufferEncoding): Promise<string> {
    return new Promise(function readStdinSync(resolve): void {
        let input = '';
        process.stdin.setEncoding(encoding);
        process.stdin.resume();

        process.stdin.on('data', function(chunk) {
            input += chunk;
        }).on('end', () => {
            resolve(input);
        })
    })
}