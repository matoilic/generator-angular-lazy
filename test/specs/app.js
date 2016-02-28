/*eslint-disable */
'use strict';
/*eslint-enable */
/* eslint-disable no-console, no-use-before-define */
/**
 * Some parts of this process was based and inspired in the one used in:
 * https://github.com/angular-fullstack/generator-angular-fullstack
 */

const path = require('path');
const fs = require('fs-extra');
const yeomanAssert = require('yeoman-assert');
const yeomanTest = require('yeoman-test');
const testUtil = require('../lib/util');
//
describe('Angular Lazy - App', function () {
    const coreFiles = require('./files/app-coreFiles');
    const stateFiles = require('./files/stateFiles');
    const statei18nFiles = require('./files/state-i18nFiles');
    const i18nFiles = require('./files/app-i18nFiles');
    let gen;
    const defaultOptions = {
        i18n: true,
        locales: ['en', 'pt'],
        defaultLocale: 'en',
        bootstrapCss: false,
        bootstrapJs: false,
        indexRouteName: 'index'
    };
    beforeEach(function (done) {
        this.timeout(10000);
        const deps = [
            '../../../app',
            '../../../state'
        ];
        yeomanTest.testDirectory(path.join(__dirname, '..', 'fixtures', 'temp'), function (err) {
            if (err) {
                return done(err);
            }
            gen = yeomanTest.createGenerator('angular-lazy:app', deps, [], {
                'skip-install': true,
                'root': null
            });
            gen.conflicter.force = true;
            done();
        });
    });
    describe('> generate with default options', function () {
        this.timeout(20000);
        beforeEach(function () {
            yeomanTest.mockPrompt(gen, defaultOptions);
        });
        it('>should have correct files generated', function (done) {
            gen.run(function () {
                const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
                yeomanAssert.ok(packageJson.jspm.dependencies['angular-translate'] !== undefined);
                yeomanAssert.file(coreFiles
                    .concat(testUtil.getFilesToTest(stateFiles, 'index'))
                    .concat(i18nFiles)
                    .concat(testUtil.getFilesToTest(statei18nFiles, 'index')));
                done();
            });
        });
        it('>should only have correct files generated', function (done) {
            gen.run(function () {
                testUtil.assertOnlyFiles(coreFiles
                    .concat(testUtil.getFilesToTest(stateFiles, 'index'))
                    .concat(i18nFiles)
                    .concat(testUtil.getFilesToTest(statei18nFiles, 'index')), done);
            });
        });
        it('>should have correct default options generated', function (done) {
            gen.run(function () {
                const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
                yeomanAssert.ok(packageJson.jspm.dependencies['angular-ui-bootstrap'] === undefined);
                yeomanAssert.ok(packageJson.devDependencies['bootstrap-sass'] === undefined);
                yeomanAssert.noFileContent(path.resolve(path.join('gulp-tasks', 'compile-stylesheets.js')),
                    'path.resolve(\'node_modules/bootstrap-sass/assets/stylesheets\')');
                yeomanAssert.noFileContent(path.resolve(path.join('src', 'components', 'application', 'stylesheets', 'application.scss')),
                    '@import "bootstrap";');
                done();
            });
        });
    });
    describe('generate with other options', function () {
        this.timeout(20000);
        // test diferent default state name
        it('>should generate expected app name', function (done) {
            defaultOptions.appName = 'ThisIsMyAppName';
            yeomanTest.mockPrompt(gen, defaultOptions);
            gen.run(function () {
                yeomanAssert.fileContent(path.resolve('package.json'), '"name": "this-is-my-app-name",');
                yeomanAssert.fileContent(path.resolve('index.html'), '<title>This is my app name</title>');
                done();
            });
        });
        it('>should not generate i18n files when answering No to include angular-translate', function (done) {
            defaultOptions.i18n = false;
            yeomanTest.mockPrompt(gen, defaultOptions);
            gen.run(function () {
                const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
                yeomanAssert.ok(packageJson.jspm.dependencies['angular-translate'] === undefined);
                testUtil.assertOnlyFiles(coreFiles
                    .concat(testUtil.getFilesToTest(stateFiles, 'index')), done);
            });
        });
        it('>should include angular-ui-bootstrap when answering Yes to "Bootstrap Javascript Components"', function (done) {
            defaultOptions.bootstrapJs = true;
            yeomanTest.mockPrompt(gen, defaultOptions);
            gen.run(function () {
                const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
                yeomanAssert.ok(packageJson.jspm.dependencies['angular-ui-bootstrap'] !== undefined);
                done();
            });
        });
        it('>should include bootstrap-sass when answering Yes to "Bootstrap CSS components"', function (done) {
            defaultOptions.bootstrapCss = true;
            yeomanTest.mockPrompt(gen, defaultOptions);
            gen.run(function () {
                const packageJson = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
                yeomanAssert.ok(packageJson.devDependencies['bootstrap-sass'] !== undefined);
                yeomanAssert.fileContent(path.resolve(path.join('gulp-tasks', 'compile-stylesheets.js')),
                    'path.resolve(\'node_modules/bootstrap-sass/assets/stylesheets\')');
                yeomanAssert.fileContent(path.resolve(path.join('src', 'components', 'application', 'stylesheets', 'application.scss')),
                    '@import "bootstrap";');
                done();
            });
        });
        it('>should have correct files generated for diferent default state name', function (done) {
            // Only testing generated filenames
            // the remaining festures are tested in ./state.js
            defaultOptions.indexRouteName = 'main';
            defaultOptions.i18n = false;
            yeomanTest.mockPrompt(gen, defaultOptions);
            gen.run(function () {
                testUtil.assertOnlyFiles(coreFiles
                    .concat(testUtil.getFilesToTest(stateFiles, 'main')), done);
            });
        });
    });
});
