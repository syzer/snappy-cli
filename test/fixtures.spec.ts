import * as mockSTDIN from 'mock-stdin';
import * as cli from '../lib/cli';
import YargsPromise from 'yargs-promise';
import * as stdin from '../lib/stdin';
import * as stdout from '../lib/stdout';
import { readFileSync, unlinkSync } from 'fs';
import { Encoding, StdIO } from '../lib/constants';

const plainFile = './test/fixtures/urls.txt';
const plainData = readFileSync(plainFile).toString(Encoding.Utf8);
const plainDataBuffer = Buffer.from(plainData, Encoding.Utf8);
const compressedFile = './test/fixtures/urls.snappy';
const compressedData = readFileSync(compressedFile);

const tempOut = './test/out';

describe('integration', () => {
    let parser: YargsPromise<cli.ProgramArguments>;
    let stdinMock: mockSTDIN.MockSTDIN;
    let readSpy: jest.SpyInstance;
    let writeSpy: jest.SpyInstance;

    beforeEach(() => {
        parser = new YargsPromise(cli.program);
        stdinMock = mockSTDIN.stdin();
        readSpy = jest.spyOn(stdin, 'readFileOrStdin');
        writeSpy = jest.spyOn(stdout, 'writeFileOrStdout');
        jest.spyOn(process.stdout, 'write').mockImplementation();
    });
    afterEach(() => {
        readSpy.mockRestore();
        writeSpy.mockRestore();
        stdinMock.restore();
        try {
            unlinkSync(tempOut);
        } catch (e) {}
    });

    describe('compress', () => {
        it('compresses accurately from stdin to stdout', (done) => {
            parser.yargs.onFinishCommand(() => {
                expect(readSpy).toHaveBeenCalledWith(StdIO.In, Encoding.Utf8);
                expect(writeSpy).toHaveBeenCalledWith(StdIO.Out, compressedData);
                done();
            });
            parser.parse('');
            stdinMock.send(plainData);
            stdinMock.end();
        });
        it('compresses accurately from stdin to a file', (done) => {
            parser.yargs.onFinishCommand(() => {
                expect(readSpy).toHaveBeenCalledWith(StdIO.In, Encoding.Utf8);
                expect(readSpy).toReturnWith(Promise.resolve(plainData));
                expect(writeSpy).toHaveBeenCalledWith(tempOut, compressedData);
                done();
            });
            parser.parse(`-o ${tempOut}`);
            stdinMock.send(plainData);
            stdinMock.end();
        });
        it('compresses accurately from a file to stdout', async (done) => {
            parser.yargs.onFinishCommand(() => {
                expect(readSpy).toHaveBeenCalledWith(plainFile, Encoding.Utf8);
                expect(readSpy).toReturnWith(Promise.resolve(plainData));
                expect(writeSpy).toHaveBeenCalledWith(StdIO.Out, compressedData);
                done();
            });
            await parser.parse(`${plainFile}`);
        });
        it('compresses accurately from a file to a file', async (done) => {
            parser.yargs.onFinishCommand(() => {
                expect(readSpy).toHaveBeenCalledWith(plainFile, Encoding.Utf8);
                expect(readSpy).toReturnWith(Promise.resolve(plainData));
                expect(writeSpy).toHaveBeenCalledWith(tempOut, compressedData);
                done();
            });
            await parser.parse(`${plainFile} ${tempOut}`);
        });
    });

    describe('decompress', () => {
        it('decompresses accurately from stdin to stdout', (done) => {
            parser.yargs.onFinishCommand(() => {
                expect(readSpy).toHaveBeenCalledWith(StdIO.In, Encoding.Hex);
                expect(writeSpy).toHaveBeenCalledWith(StdIO.Out, plainDataBuffer);
                done();
            });
            parser.parse('d');
            stdinMock.send(compressedData);
            stdinMock.end();
        });
        it('decompresses accurately from stdin to a file', (done) => {
            parser.yargs.onFinishCommand(() => {
                expect(readSpy).toHaveBeenCalledWith(StdIO.In, Encoding.Hex);
                expect(readSpy).toReturnWith(Promise.resolve(compressedData));
                expect(writeSpy).toHaveBeenCalledWith(tempOut, plainDataBuffer);
                done();
            });
            parser.parse(`d -o ${tempOut}`);
            stdinMock.send(compressedData);
            stdinMock.end();
        });
        it('decompresses accurately from a file to stdout', async (done) => {
            parser.yargs.onFinishCommand(() => {
                expect(readSpy).toHaveBeenCalledWith(compressedFile, Encoding.Hex);
                expect(readSpy).toReturnWith(Promise.resolve(compressedData));
                expect(writeSpy).toHaveBeenCalledWith(StdIO.Out, plainDataBuffer);
                done();
            });
            await parser.parse(`d ${compressedFile}`);
        });
        it('decompresses accurately from a file to a file', async (done) => {
            parser.yargs.onFinishCommand(() => {
                expect(readSpy).toHaveBeenCalledWith(compressedFile, Encoding.Hex);
                expect(readSpy).toReturnWith(Promise.resolve(compressedData));
                expect(writeSpy).toHaveBeenCalledWith(tempOut, plainDataBuffer);
                done();
            });
            await parser.parse(`d ${compressedFile} ${tempOut}`);
        });
    });
});