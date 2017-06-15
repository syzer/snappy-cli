Snappy-cli
==========

[![Greenkeeper badge](https://badges.greenkeeper.io/syzer/snappy-cli.svg)](https://greenkeeper.io/)

Installation
------------

        npm install -g snappy-cli

Why
===
Snappy is compression algorithm, and it is really FAST, one fastest on market.


Usage -compression:
===================

        snappy test.tar test.tar.sz


Usage with tar:
===============

        tar -cvf test.tar ./directory
        snappy test.tar test.tar.sz


Usage -decompression:
=====================
This will create test.tar file

        snappy -e test.tar.sz


Usage -decompression with tar:
==============================

        snappy -e test.tar.sz
        tar -xvf test.tar

Development
============
        git checkout
        cd snappy-cli
        npm install --save-dev
        npm install -g

TODO:
=====
[ ] Compression of multiple files without tar
