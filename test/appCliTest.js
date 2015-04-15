/**
 * Created by syzer on 3/26/2015.
 */
var expect = require('chai').expect;
var fs = require('fs');

var FILE_COMPRESSED = 'test/fixture.sz';

describe('appCLiArgumentsTest', function () {

    it('prints usage after no params in exec', function (done) {
        var bin = require('../bin');

        expect(function () {
            fs.lstatSync(FILE_COMPRESSED);
        }).to.throw(Error);
        done();
    });

});
