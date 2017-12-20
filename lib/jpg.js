'use strict';

var execFile = require('child_process').execFile,
    mozjpeg = require('mozjpeg');

module.exports = function optimizeJpg(dest, src, next, opt) {
    var _opt = opt || {};

    execFile(mozjpeg, [
        '-sample', '1x1',
        '-quality', _opt.quality || 100,
        '-quant-table', '2',
        '-notrellis',
        '-progressive',
        '-outfile', dest, src
    ], next);
};
