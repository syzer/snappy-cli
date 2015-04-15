#!/usr/bin/env node

var arg1, arg2, action = 'compress';

if (process.argv.length <= 2) {
    console.log('snappy, usage:');
    console.log('-----------------');
    console.log('compression:');
    console.log('snappy [input] [output]');
    console.log('decompression:');
    console.log('snappy -e [input]');
    return;
}

arg1 = process.argv[2];

arg2 = process.argv[3] || (arg1 + '.sz');

if ('-e' === arg1) {
    arg1 = arg2.replace('.tar.sz', '.tar');
    action = 'decompress';
    console.log(action);
}

var app = require('../app')(arg1, arg2);

if ('compress' === action) {
    app.compress();
    return;
}

app.decompress();
