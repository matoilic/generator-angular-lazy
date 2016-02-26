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
describe('Angular Lazy - Directive', function () {
    const directiveFiles = require('./files/app-directiveFiles');
    const i18nFiles = require('./files/app-directive-i18nFiles');
    let gen;
    const deps = [
        '../../../directive'
    ];
    let defaultConfig;

    function writeConfig(config) {
        fs.outputJSONSync(path.join(__dirname, '..', 'fixtures', 'temp', '.yo-rc.json'), config);
    }

    function getFilesToTest(files, name) {
        return files.map((item) => {
            return item
                .replace('$prefix', defaultConfig.prefix ? '/'.concat(defaultConfig.prefix) : '')
                .replace(/\$name/g, '/'.concat(name || defaultConfig.name));
        });
    }

    function createGenerator() {
        writeConfig(defaultConfig.config);
        gen = yeomanTest.createGenerator(
            'angular-lazy:directive',
            deps,
            [defaultConfig.name],
            defaultConfig.prefix ? { 'prefix': defaultConfig.prefix } : {}
        );
        gen.conflicter.force = true;
    }

    beforeEach(function (done) {
        yeomanTest.testDirectory(path.join(__dirname, '..', 'fixtures', 'temp'), function (err) {
            if (err) {
                return done(err);
            }
            done();
        });
    });
    beforeEach(function () {
        defaultConfig = {
            name: 'my-dir',
            prefix: '',
            config: {
                'generator-angular-lazy': {
                    'i18n': true,
                    'locales': ['pt', 'en'],
                    'defaultLocale': 'pt'
                }
            }
        };
    });
    describe('> generate with default options', function () {
        this.timeout(20000);
        it('>should have correct files generated', function (done) {
            createGenerator();
            gen.run(function () {
                const filesToTest = getFilesToTest(directiveFiles.concat(i18nFiles));
                yeomanAssert.file(filesToTest);
                testUtil.assertOnlyFiles(filesToTest, done);
            });
        });
    });
    describe('> generate with other options', function () {
        this.timeout(20000);
        it('>should have correct files generated when translate option set to false', function (done) {
            defaultConfig.config['generator-angular-lazy'].i18n = false;
            createGenerator();
            gen.run(function () {
                const filesToTest = getFilesToTest(directiveFiles);
                yeomanAssert.file(filesToTest);
                testUtil.assertOnlyFiles(filesToTest, done);
            });
        });
        it('>should have correct files generated when prefix is set', function (done) {
            defaultConfig.config['generator-angular-lazy'].i18n = false;
            defaultConfig.prefix = 'myfeature';
            createGenerator();
            gen.run(function () {
                const filesToTest = getFilesToTest(directiveFiles);
                yeomanAssert.file(filesToTest);
                testUtil.assertOnlyFiles(filesToTest, done);
            });
        });
        it('>should have correct files generated when name dir is set in camel came', function (done) {
            defaultConfig.config['generator-angular-lazy'].i18n = false;
            defaultConfig.prefix = '';
            defaultConfig.name = 'myName';
            createGenerator();
            gen.run(function () {
                const filesToTest = getFilesToTest(directiveFiles, 'my-name');
                yeomanAssert.file(filesToTest);
                testUtil.assertOnlyFiles(filesToTest, done);
            });
        });
    });
});
