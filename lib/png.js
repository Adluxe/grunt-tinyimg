'use strict';

var execFile = require('child_process').execFile,
    pngquant = require('pngquant-bin');

module.exports = function optimizePng(dest, src, next) {

    execFile(pngquant, ['256', '-f', '--speed', '1', '--quality', '70-95', '-o', dest, src], next);

};
