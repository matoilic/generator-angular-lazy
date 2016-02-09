/*eslint-disable */
'use strict';
/*eslint-enable */

const connect = require('gulp-connect');
const path = require('path');
const protractor = require('gulp-protractor');

module.exports = (gulp, config) => {
    gulp.task('test-e2e', ['build', 'webdriver-update'], function (done) {
        connect.server({
            port: config.serverPortTest,
            root: ['.']
        });

        gulp
            .src(path.join(config.paths.build.output + '/**/*-test.js'))
            .pipe(protractor.protractor({
                configFile: __dirname + '/../config/protractor.js'
            }))
            .on('error', function (err) {
                connect.serverClose();

                throw err;
            })
            .on('end', function () {
                connect.serverClose();

                done();
            });
    });
};
