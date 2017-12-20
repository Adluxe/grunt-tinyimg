'use strict';

var execFile = require('child_process').execFile,
    pngquant = require('pngquant-bin');

module.exports = function optimizePng(dest, src, next, opt) {
    var _opt = opt || {};

    execFile(pngquant, [
        _opt.quality || 256,
        '-f',
        '--speed', '1',
        '--quality', '70-95',
        '-o', dest, src], next);
};
