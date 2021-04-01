import yargs from 'yargs';
import * as snappy from 'snappy';

import { readFileOrStdin } from './stdin';
import { writeFileOrStdout } from './stdout';

import { Encoding, StdIO } from './constants';

export interface ProgramArguments extends yargs.Arguments {
    input: string | '-';
    output: string | '-';
    encoding: BufferEncoding;
}

export const program = yargs([])
    .command(['c [input] [output]', 'compress', '*'], '', () => {}, compress)
    .command(['d [input] [output]', 'decompress'], '', () => {}, decompress)
    .option('input', {
        alias: 'i',
        desc: 'file path or will read from stdin',
        default: StdIO.In,
        defaultDescription: 'stdin'
    })
    .option('output', {
        alias: 'o',
        desc: 'file path or will write to stdout',
        default: StdIO.Out,
        defaultDescription: 'stdout'
    })
    .option('encoding', {
        alias: 'k',
        default: Encoding.Utf8,
        desc: `input data encoding`
    })
    .alias('h', 'help')
    .help('help')

export async function compress(argv: ProgramArguments): Promise<void> {
    const input = await readFileOrStdin(argv.input, argv.encoding);
    if (!input) {
        return;
    }
    const payload = snappy.compressSync(Buffer.from(input, argv.encoding));
    writeFileOrStdout(argv.output, payload);
}

export async function decompress(argv: ProgramArguments): Promise<void> {
    const input = await readFileOrStdin(argv.input, Encoding.Hex);
    if (!input) {
        return;
    }
    const payload = snappy.uncompressSync(Buffer.from(input, Encoding.Hex), {asBuffer: true});
    writeFileOrStdout(argv.output, payload);
}