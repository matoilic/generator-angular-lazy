/*eslint-disable */
'use strict';
/*eslint-enable */
/* eslint-disable no-console, no-use-before-define */
/**
 * Tests for:
 * angular-lazy:directive
 * angular-lazy:component
 *
 * Some parts of this process was based and inspired in the one used in:
 * https://github.com/angular-fullstack/generator-angular-fullstack
 */

const path = require('path');
const fs = require('fs-extra');
const yeomanAssert = require('yeoman-assert');
const yeomanTest = require('yeoman-test');
const testUtil = require('../lib/util');
//
const componentsConfig = [
    {
        title: 'directive',
        name: ['my-dir', 'myDir'],
        deps: [
            '../../../directive'
        ],
        files: require('./files/directiveFiles'),
        i18nFiles: require('./files/directive-i18nFiles')
    },
    {
        title: 'component',
        name: ['my-comp', 'myComp'],
        deps: [
            '../../../component'
        ],
        files: require('./files/componentFiles'),
        i18nFiles: require('./files/component-i18nFiles')
    }
];

componentsConfig.forEach((item) => {
    describe('Angular Lazy - '.concat(item.title), function () {
        this.timeout(20000);
        const itemFiles = item.files;
        const itemI18nFiles = item.i18nFiles;
        const deps = item.deps;
        let gen;
        let defaultConfig;

        function writeConfig(config) {
            fs.outputJSONSync(path.join(__dirname, '..', 'fixtures', 'temp', '.yo-rc.json'), config);
        }

        function getFilesToTest(files, name) {
            return testUtil.getFilesToTest(files, name || defaultConfig.name, defaultConfig.prefix);
        }

        function createGenerator() {
            writeConfig(defaultConfig.config);
            gen = yeomanTest.createGenerator(
                'angular-lazy:'.concat(item.title),
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
                name: item.name[0],
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
        it('>should have correct files generated with default options', function (done) {
            createGenerator();
            gen.run(function () {
                const filesToTest = getFilesToTest(itemFiles.concat(itemI18nFiles));
                yeomanAssert.file(filesToTest);
                testUtil.assertOnlyFiles(filesToTest, done);
            });
        });
        it('>should have correct files generated when translate option set to false', function (done) {
            defaultConfig.config['generator-angular-lazy'].i18n = false;
            createGenerator();
            gen.run(function () {
                const filesToTest = getFilesToTest(itemFiles);
                yeomanAssert.file(filesToTest);
                testUtil.assertOnlyFiles(filesToTest, done);
            });
        });
        it('>should have correct files generated when prefix is set', function (done) {
            defaultConfig.config['generator-angular-lazy'].i18n = false;
            defaultConfig.prefix = 'myfeature';
            createGenerator();
            gen.run(function () {
                const filesToTest = getFilesToTest(itemFiles);
                yeomanAssert.file(filesToTest);
                testUtil.assertOnlyFiles(filesToTest, done);
            });
        });
        it('>should have correct files generated when name dir is set in camel came', function (done) {
            defaultConfig.config['generator-angular-lazy'].i18n = false;
            defaultConfig.prefix = '';
            defaultConfig.name = item.name[1];
            createGenerator();
            gen.run(function () {
                const filesToTest = getFilesToTest(itemFiles, item.name[0]);
                yeomanAssert.file(filesToTest);
                testUtil.assertOnlyFiles(filesToTest, done);
            });
        });
    });
});
