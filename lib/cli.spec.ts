import * as cli from './cli';
import * as snappy from 'snappy';
import YargsPromise from 'yargs-promise';
import * as stdin from './stdin';
import * as stdout from './stdout';
import { Encoding, StdIO } from './constants';

jest.mock('snappy');
jest.mock('./stdin');
jest.mock('./stdout');

describe('CLI', () => {
    const inputFile = '/foo/bar';
    const outputFile = '/foo/bar';

    const inputData = 'input';
    const compressedData = Buffer.from('compressed', Encoding.Utf8);
    const uncompressedData = Buffer.from('uncompressed', Encoding.Utf8);

    let readSpy: jest.SpyInstance;
    let writeSpy: jest.SpyInstance;

    let parser: YargsPromise<cli.ProgramArguments>;

    beforeEach(() => {
        parser = new YargsPromise(cli.program);
        jest.spyOn(snappy, 'compressSync').mockReturnValue(compressedData);
        jest.spyOn(snappy, 'uncompressSync').mockReturnValue(uncompressedData);
        readSpy = jest.spyOn(stdin, 'readFileOrStdin').mockReturnValue(Promise.resolve(inputData));
        writeSpy = jest.spyOn(stdout, 'writeFileOrStdout').mockReturnValue(void 0);
    });

    describe('compress', () => {
        it('reads stdin by default', async () => {
            const result = await parser.parse('');
            expect(result.error).toBeUndefined();
            expect(result.argv?.input).toEqual(StdIO.In);
            expect(result.argv?.output).toEqual(StdIO.Out);
            expect(result.argv?.encoding).toEqual(Encoding.Utf8);
            expect(readSpy).toHaveBeenCalledWith(StdIO.In, Encoding.Utf8);
            expect(writeSpy).toHaveBeenCalledWith(StdIO.Out, compressedData);
        });
        it('takes an input file and writes to stdout by default', async () => {
            const result = await parser.parse(`c ${inputFile}`);
            expect(result.error).toBeUndefined();
            expect(result.argv?.input).toEqual(inputFile);
            expect(result.argv?.output).toEqual(StdIO.Out);
            expect(result.argv?.encoding).toEqual(Encoding.Utf8);
            expect(readSpy).toHaveBeenCalledWith(inputFile, Encoding.Utf8);
            expect(writeSpy).toHaveBeenCalledWith(StdIO.Out, compressedData);
        });
        it('takes an input file and writes to output file', async () => {
            const result = await parser.parse(`compress ${inputFile} ${outputFile}`);
            expect(result.error).toBeUndefined();
            expect(result.argv?.input).toEqual(inputFile);
            expect(result.argv?.output).toEqual(outputFile);
            expect(result.argv?.encoding).toEqual(Encoding.Utf8);
            expect(readSpy).toHaveBeenCalledWith(inputFile, Encoding.Utf8);
            expect(writeSpy).toHaveBeenCalledWith(outputFile, compressedData);
        });
        it('reads stdin and writes to output file', async () => {
            const result = await parser.parse(`-o ${outputFile}`);
            expect(result.error).toBeUndefined();
            expect(result.argv?.input).toEqual(StdIO.In);
            expect(result.argv?.output).toEqual(outputFile);
            expect(result.argv?.encoding).toEqual(Encoding.Utf8);
            expect(readSpy).toHaveBeenCalledWith(StdIO.In, Encoding.Utf8);
            expect(writeSpy).toHaveBeenCalledWith(outputFile, compressedData);
        });
    });

    describe('decompress', () => {
        it('reads stdin by default', async () => {
            const result = await parser.parse('d');
            expect(result.error).toBeUndefined();
            expect(result.argv?.input).toEqual(StdIO.In);
            expect(result.argv?.output).toEqual(StdIO.Out);
            expect(result.argv?.encoding).toEqual(Encoding.Utf8);
            expect(readSpy).toHaveBeenCalledWith(StdIO.In, Encoding.Utf8);
            expect(writeSpy).toHaveBeenCalledWith(StdIO.Out, uncompressedData);
        });
        it('takes an input file and writes to stdout by default', async () => {
            const result = await parser.parse(`d ${inputFile}`);
            expect(result.error).toBeUndefined();
            expect(result.argv?.input).toEqual(inputFile);
            expect(result.argv?.output).toEqual(StdIO.Out);
            expect(result.argv?.encoding).toEqual(Encoding.Utf8);
            expect(readSpy).toHaveBeenCalledWith(inputFile, Encoding.Utf8);
            expect(writeSpy).toHaveBeenCalledWith(StdIO.Out, uncompressedData);
        });
        it('takes an input file and writes to output file', async () => {
            const result = await parser.parse(`d ${inputFile} ${outputFile}`);
            expect(result.error).toBeUndefined();
            expect(result.argv?.input).toEqual(inputFile);
            expect(result.argv?.output).toEqual(outputFile);
            expect(result.argv?.encoding).toEqual(Encoding.Utf8);
            expect(readSpy).toHaveBeenCalledWith(inputFile, Encoding.Utf8);
            expect(writeSpy).toHaveBeenCalledWith(outputFile, uncompressedData);
        });
        it('reads stdin and writes to output file', async () => {
            const result = await parser.parse(`d -o ${outputFile}`);
            expect(result.error).toBeUndefined();
            expect(result.argv?.input).toEqual(StdIO.In);
            expect(result.argv?.output).toEqual(outputFile);
            expect(result.argv?.encoding).toEqual(Encoding.Utf8);
            expect(readSpy).toHaveBeenCalledWith(StdIO.In, Encoding.Utf8);
            expect(writeSpy).toHaveBeenCalledWith(outputFile, uncompressedData);
        });
    });
});