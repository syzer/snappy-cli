import * as fs from 'fs';
import * as mockSTDIN from 'mock-stdin';
import { Encoding, StdIO } from './constants';
import * as stdin from './stdin';

jest.mock('fs');

describe('readFileOrStdin', () => {
    let stdinMock: mockSTDIN.MockSTDIN;
    let stdinResumeSpy: jest.SpyInstance;
    let setEncodingSpy: jest.SpyInstance;

    beforeEach(() => {
        stdinMock = mockSTDIN.stdin();
        stdinResumeSpy = jest.spyOn(process.stdin, 'resume');
        setEncodingSpy = jest.spyOn(process.stdin, 'setEncoding');
    });
    afterEach(() => {
        stdinMock.restore();
    });
    
    it('works with stdin', async () => {
        process.nextTick(() => {
            stdinMock.send('foo');
            stdinMock.end();
        });
        const result = await stdin.readFileOrStdin(StdIO.In, Encoding.Utf8);
        expect(result).toEqual('foo');
        expect(setEncodingSpy).toHaveBeenCalledWith(Encoding.Utf8);
        expect(fs.readFileSync).not.toHaveBeenCalled();
    });

    it('works with files', async () => {
        await stdin.readFileOrStdin('./foobar', Encoding.Utf8);
        expect(fs.readFileSync).toHaveBeenCalledWith('./foobar', Encoding.Utf8);
        expect(stdinResumeSpy).not.toHaveBeenCalled();
    });
});
