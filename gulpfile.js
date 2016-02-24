/* eslint-disable */
'use strict';
/* eslint-enable */
/* eslint-disable no-console */
const gulp = require('gulp');
const gutil = require('gulp-util');
const mocha = require('gulp-mocha');
const fs = require('fs-extra');
const path = require('path');
const runSequence = require('run-sequence');
const childProcess = require('child_process');
const vinylPaths = require('vinyl-paths');
const del = require('del');
/**
 * Some parts of this test process was based and inspired in the one used in:
 * https://github.com/angular-fullstack/generator-angular-fullstack
 */
gulp.task('installnpm', function (done) {
    gutil.log('Installing npm packages...');
    childProcess.exec('npm install --quiet', { cwd: './test/fixtures' }, function (/* error, stdout, stderr */) {
        // we dont want to eval the result as it will be done in test spec
        // so we are just returning good
        done();
    });
});
gulp.task('installjspm', function (done) {
    gutil.log('Installing jspm packages...');
    childProcess.exec('jspm install --yes', { cwd: './test/fixtures' }, function (/* error, stdout, stderr */) {
        // we dont want to eval the result as it will be done in test spec
        // so we are just returning good
        done();
    });
});
gulp.task('copyManifests', function (done) {
    const genVer = require('./package.json').version;
    const dest = path.join(__dirname, 'test/fixtures');
    fs.ensureDir(dest, (err) => {
        if (err) {
            done(err);
        }
        // read file, strip all ejs conditionals, and parse as json
        const json = JSON.parse(fs.readFileSync(path.resolve('app/templates/core/_package.json'), 'utf8').replace(/<%(.*)%>/g, ''));
        json.name = 'testApp';
        json.version = genVer;
        // stringify json and write it to the destination
        fs.writeFile(path.resolve(path.join(dest, 'package.json')), JSON.stringify(json, null, 2), (error) => {
            done(error ? error : undefined);
        });
    });
});
gulp.task('cleanFixtures', function () {
    return gulp.src([path.join(__dirname, 'test/fixtures')])
        .pipe(vinylPaths(del));
});
gulp.task('testPrepare', function (done) {
    return runSequence(
        'cleanFixtures',
        'copyManifests',
        'installnpm',
        'installjspm',
        done
    );
});
gulp.task('test', ['testPrepare'], function () {
    return gulp.src('test/*_spec.js', { read: false })
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({ reporter: 'spec'/* 'nyan' */ }))
        .once('error', function (err) {
            console.log(err);
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});
const eslint = require('gulp-eslint');
gulp.task('eslint', () => {
    return gulp
        .src(['gulpfile.js', 'test/**/*.js', '!test/fixtures/**/*'])
        .pipe(eslint())
        .pipe(eslint.format());
});
gulp.task('default', ['test']);
