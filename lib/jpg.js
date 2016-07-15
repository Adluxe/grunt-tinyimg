'use strict';

var execFile = require('child_process').execFile,
    mozjpeg = require('mozjpeg');

module.exports = function optimizeJpg(dest, src, next) {

  execFile(mozjpeg, ['-sample', '1x1', '-quant-table', '2', '-notrellis', '-outfile', dest, src], next);

};
