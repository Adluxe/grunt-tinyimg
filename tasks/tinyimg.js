'use strict';

var path = require('path'),
    async = require('async'),
    fs = require('fs'),
    filesize = require('filesize'),
    tmp = require('tmp'),
    png = require('../lib/png'),
    jpg = require('../lib/jpg'),
    svg = require('../lib/svg');

module.exports = function (grunt) {

    var total = 0,
        subtotal = 0,
        _jpgQuality,
        _pngColors,

        optimizeFile = function (file, callback) {

            var src = file.src,
                dest = file.dest,
                extension = path.extname(file.src).toLowerCase();

            tmp.file({
                postfix: extension
            }, function (error, tmpDest, tmpFd) {

                if (error || !tmpDest) {

                    // Copy original to destination
                    grunt.file.copy(src, dest);
                    grunt.log.writeln('Skipped ' + dest.cyan + ' [no savings]');
                    grunt.log.error('Failed to create temporary file.');

                    return callback(error);
                }

                function next(err) {

                    if (err) {

                        // Copy original to destination
                        grunt.file.copy(src, dest);
                        grunt.log.writeln('Skipped ' + dest.cyan + ' [no savings]');
                        grunt.log.error(err.message);
                        console.log(err);
                        return callback(err);
                    }

                    var oldFile = fs.statSync(src).size,
                        newFile = fs.statSync(tmpDest).size,
                        savings = Math.floor((oldFile - newFile) / oldFile * 100);

                    // Only copy the temp file if it's smaller than the original
                    if (newFile < oldFile) {
                        total += oldFile - newFile;
                        subtotal += oldFile - newFile;
                        grunt.file.copy(tmpDest, dest);
                        grunt.log.writeln('Optimized ' + dest.cyan +
                            ' [saved ' + savings + ' % - ' +
                            filesize(oldFile, 1, false) + ' → ' +
                            filesize(newFile, 1, false) + ']');
                    } else {
                        grunt.file.copy(src, dest);
                        grunt.log.writeln('Skipped ' + dest.cyan + ' [no savings]');
                    }

                    return callback();
                }

                fs.closeSync(tmpFd);

                if (extension === '.png') {
                    png(tmpDest, src, next, {quality:_pngColors});
                } else if (extension === '.jpg' || extension === '.jpeg') {
                    jpg(tmpDest, src, next, {quality:_jpgQuality});
                } else if (extension === '.svg') {
                    svg(tmpDest, src, next);
                } else if (extension === '.gif') {
                    grunt.file.copy(src, tmpDest);
                    next();
                } else {
                    grunt.log.writeln(src.cyan + ' not supported.');
                    return callback();
                }
            });
        },

        optimizeFiles = function (gruntFiles, callback) {

            var queue = async.queue(optimizeFile, 4);

            queue.drain = function () {
                grunt.log.writeln('Run savings: ' + filesize(subtotal, 1, false).green);
                grunt.log.writeln('Total savings: ' + filesize(total, 1, false).green);
                subtotal = 0;
                return callback();
            };

            gruntFiles.forEach(function (f) {
                var dest = f.dest,
                    files = f.src.filter(function (filepath) {
                        if (!grunt.file.exists(filepath)) {
                            grunt.log.warn('\nSource file "' + filepath + '" not found.');
                            return false;
                        } else {
                            return true;
                        }
                    }).map(function (filepath) {
                            return {
                                src: filepath,
                                dest: dest
                            };
                        });

                if (files.length === 0) {
                    grunt.log.writeln('No images were found for given path(s): ' + f.orig.src.join(', '));
                    return callback();
                }

                queue.push(files);
            });
        };

    grunt.registerMultiTask('tinyimg', 'Optimize png, jpg and svg images.', function (jpgQuality, pngColors) {
        _jpgQuality = jpgQuality || 100;
        _pngColors = pngColors || 256;
        optimizeFiles(this.files, this.async());
    });
};
