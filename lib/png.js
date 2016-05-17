'use strict';

var execFile = require('child_process').execFile;
var pngquant = require('pngquant-bin');

module.exports = function optimizePng(dest, src, next) {

  execFile(pngquant, ['256', '--speed', '1', '--quality', '80-95', '-o', dest, src], next);

};
