/**
 * Created by syzer on 4/15/2015.
 */
module.exports = function (fileUncompressed, fileCompressed) {
    'use strict';

    var fs = require('fs');
    var snappy = require('snappy');
    var through2 = require('through2');

    return {

        compress: function () {
            var writable = fs.createWriteStream(fileCompressed);

            fs
                .createReadStream(fileUncompressed)
                .pipe(through2(pack))
                .pipe(writable)
        },
        decompress: function () {
            console.log('\n\n++++++++', fileUncompressed, fileCompressed);
            var writable = fs.createWriteStream(fileUncompressed);

            fs
                .createReadStream(fileCompressed)
                .pipe(through2(unpack))
                .pipe(writable);
        }
    };

    function unpack(chunk, enc, callback) {
        var that = this;
        snappy.uncompress(chunk, function (err, compressed) {
            that.push(compressed);
            callback();
        });
    }

    //TODO put header to file??
    function pack(chunk, enc, callback) {
        var that = this;
        snappy.compress(chunk, function (err, compressed) {
            that.push(compressed);
            callback();
        });
    }
};
