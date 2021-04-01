import * as fs from 'fs';
import { StdIO } from './constants';
import * as stdout from './stdout';

jest.mock('fs');

describe('readFileOrStdin', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('works with stdout', () => {
        const stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation();
        stdout.writeFileOrStdout(StdIO.Out, 'foo');
        expect(stdoutSpy).toHaveBeenCalledWith('foo');
        expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    it('works with files', async () => {
        const stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation();
        stdout.writeFileOrStdout('bar', 'foo');
        expect(fs.writeFileSync).toHaveBeenCalledWith('bar', 'foo');
        expect(stdoutSpy).not.toHaveBeenCalled();
    });
});
