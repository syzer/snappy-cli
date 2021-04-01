import * as fs from 'fs';
import { StdIO } from './constants';

export function writeFileOrStdout(filePath: string, content: string | Uint8Array): void {
    if (filePath === StdIO.Out) {
        process.stdout.write(content);
    } else {
        fs.writeFileSync(filePath, content);
    }
}