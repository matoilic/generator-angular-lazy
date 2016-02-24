/*eslint-disable */
'use strict';
/*eslint-enable */
/* eslint-disable no-console, no-use-before-define, no-param-reassign */
const path = require('path');
const recursiveReadDir = require('recursive-readdir');
const fs = require('fs-extra');
module.exports = {
    assertOnlyFiles: assertOnlyFiles,
    getDirTree: getDirTree
};
/**
 * Returns list of tree structure of directories names in a path
 *
 * @param {String}  home    - home path (top level)
 * @param {String}  from    - path to list (equals to home at top level)
 * @returns {Array}         - return array with relative (to home) directories names
 */
function getDirTree(home, from) {
    let allDirPaths = [];
    const fromDir = from || home;
    allDirPaths.push(fromDir
        .replace(home, '')
        .replace(/\\/g, '/')
        .slice(1));
    fs.readdirSync(fromDir).forEach(function (item) {
        if (fs.lstatSync(path.join(fromDir, item)).isDirectory()) {
            allDirPaths = allDirPaths.concat(getDirTree(home, path.join(fromDir, item)));
        }
    });
    return allDirPaths;
}
/**
 * Code below is from:
 * https://github.com/angular-fullstack/generator-angular-fullstack
 *
 */
/**
 * Assert that only an array of files exist at a given path
 *
 * @param  {Array}    expectedFiles - array of files
 * @param  {Function} done          - callback(error{Error})
 * @param  {String}   topLevelPath  - top level path to assert files at (optional)
 * @param  {Array}    skip          - array of paths to skip/ignore (optional)
 *
 */
function assertOnlyFiles(expectedFiles, done, topLevelPath, skip) {
    topLevelPath = topLevelPath || './';
    skip = skip || ['node_modules', 'client/bower_components', 'jspm_packages'];
    recursiveReadDir(topLevelPath, skip, function (err, actualFiles) {
        if (err) {
            return done(err);
        }
        const files = actualFiles.concat();
        expectedFiles.forEach(function (file/* , i */) {
            const index = files.indexOf(path.normalize(file));
            if (index >= 0) {
                files.splice(index, 1);
            }
        });
        if (files.length !== 0) {
            err = new Error('unexpected files found');
            err.expected = expectedFiles.join('\n');
            err.actual = files.join('\n');
            return done(err);
        }
        done();
    });
}
