/**
 * Created by syzer on 3/26/2015.
 */
var expect = require('chai').expect;
var fs = require('fs');

var FILE_TO_COMPRESS = 'test/fixture.tar';
var FILE_COMPRESSED = 'test/fixture2.tar.sz';
var FILE_DECOMPRESSED = 'test/fixture2.tar';

function cleanAll() {
    setTimeout(function () {
        fs.unlinkSync(FILE_COMPRESSED);
        fs.unlinkSync(FILE_DECOMPRESSED);
    }, 1000);
}

describe('fileCompressionTest', function () {
    //after(cleanAll);

    it('creates compressed file', function () {
        process.argv[2] = FILE_TO_COMPRESS;
        process.argv[3] = FILE_COMPRESSED;
        var bin = require('../bin');
        var fileCreated = fs.lstatSync(process.argv[3]).isFile();
        expect(fileCreated).to.be.true;
    });

    it('can decompress file', function () {
        process.argv[2] = '-e';
        process.argv[3] = FILE_COMPRESSED;
        var bin2 = require('../bin');
        var fileCreated = fs.lstatSync(FILE_DECOMPRESSED).isFile();
        expect(fileCreated).to.be.true;

    });

    it('can can compress and decompress file', function () {
        var fileOriginal = fs.readFileSync(FILE_TO_COMPRESS,'utf8');
        var fileCompressedAndDecompressed =  fs.readFileSync(FILE_DECOMPRESSED,'utf8');
        expect(fileOriginal).to.equal(fileCompressedAndDecompressed);
    });

});
