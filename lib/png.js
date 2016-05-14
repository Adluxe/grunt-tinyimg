'use strict';

var execFile = require('child_process').execFile;
var pngquant = require('pngquant-bin');

module.exports = function optimizePng(dest, src, next) {

  execFile(pngquant, ['128', '--speed', '1', '-o', dest, src], next);

};
