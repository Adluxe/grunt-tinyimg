'use strict';

var execFile = require('child_process').execFile,
    mozjpeg = require('mozjpeg');

module.exports = function optimizeJpg(dest, src, next, opt) {
    var _opt = opt || {quality:-1};

    execFile(mozjpeg, ['-sample', '1x1']
        .concat(_opt.quality >= 0 ? ['-quality', _opt.quality || 100] : [])
        .concat([
            '-quant-table', '2',
            '-notrellis',
            '-progressive',
            '-outfile', dest, src
        ]), next);
};
