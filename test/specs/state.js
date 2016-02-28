/*eslint-disable */
'use strict';
/*eslint-enable */
/* eslint-disable no-console, no-use-before-define, quotes */
/**
 * Some parts of this process was based and inspired in the one used in:
 * https://github.com/angular-fullstack/generator-angular-fullstack
 */

const path = require('path');
const fs = require('fs-extra');
const yeomanAssert = require('yeoman-assert');
const yeomanTest = require('yeoman-test');
const testUtil = require('../lib/util');
const _ = require('../../extended-lodash');
//
describe('Angular Lazy - State', function () {
    const stateFiles = require('./files/stateFiles');
    const i18nFiles = require('./files/state-i18nFiles');
    let gen;
    const deps = [
        '../../../state'
    ];
    let defaultConfig;

    function createGenerator() {
        fs.outputJSONSync(path.join(__dirname, '../fixtures/temp', '.yo-rc.json'), defaultConfig.config);
        fs.outputJSONSync(path.join(__dirname, '../fixtures/temp', 'src/components/application/config/states.json'), defaultConfig.routes);
        const options = _.merge({}, { 'target': defaultConfig.target, 'url': defaultConfig.url });
        gen = yeomanTest.createGenerator(
            'angular-lazy:state',
            deps,
            [defaultConfig.name],
            options
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
            name: 'index',
            target: undefined,
            url: undefined,
            config: {
                'generator-angular-lazy': {
                    'i18n': true,
                    'locales': ['pt', 'en'],
                    'defaultLocale': 'pt'
                }
            },
            routes: [
                {
                    "name": "app",
                    "url": "/",
                    "type": "load",
                    "src": "components/application/index"
                }
            ]
        };
    });
    this.timeout(20000);
    it('should have correct files generated with default options', function (done) {
        createGenerator();
        gen.run(function () {
            const filesToTest = testUtil.getFilesToTest(stateFiles.concat(i18nFiles), 'index');
            yeomanAssert.file(filesToTest);
            testUtil.assertOnlyFiles(filesToTest, done);
        });
    });
    it('>should have correct files generated when translate option set to false', function (done) {
        defaultConfig.config['generator-angular-lazy'].i18n = false;
        createGenerator();
        gen.run(function () {
            const filesToTest = testUtil.getFilesToTest(stateFiles, 'index');
            yeomanAssert.file(filesToTest);
            testUtil.assertOnlyFiles(filesToTest, done);
        });
    });
    it('>should have correct files generated when parent is passed in name', function (done) {
        defaultConfig.config['generator-angular-lazy'].i18n = false;
        defaultConfig.name = 'app.index.myChild';
        createGenerator();
        gen.run(function () {
            const filesToTest = testUtil.getFilesToTest(stateFiles, 'index-my-child');
            yeomanAssert.file(filesToTest);
            testUtil.assertOnlyFiles(filesToTest, done);
        });
    });
    it('>should have correct files generated when url is passed', function (done) {
        defaultConfig.config['generator-angular-lazy'].i18n = false;
        defaultConfig.name = 'index';
        defaultConfig.url = 'foo/bar';
        createGenerator();
        gen.run(function () {
            const filesToTest = testUtil.getFilesToTest(stateFiles, 'index');
            yeomanAssert.file(filesToTest);
            testUtil.assertOnlyFiles(filesToTest, done);
            yeomanAssert.fileContent(path.resolve('src/components/index-state/index-route.js'),
                /url: 'foo\/bar',/);
        });
    });
    it('>should have correct files generated when target is passed', function (done) {
        defaultConfig.config['generator-angular-lazy'].i18n = false;
        defaultConfig.target = 'view1';
        createGenerator();
        gen.run(function () {
            const filesToTest = testUtil.getFilesToTest(stateFiles, 'index');
            yeomanAssert.fileContent(path.resolve('src/components/index-state/index-route.js'),
                /views: {\n.*view1: {/);
            yeomanAssert.file(filesToTest);
            testUtil.assertOnlyFiles(filesToTest, done);
        });
    });
    it('>should have correct files generated when parent has multiple views', function (done) {
        defaultConfig.config['generator-angular-lazy'].i18n = false;
        const content = `<ui-view name="application"></ui-view>
        <ui-view name="view1"></ui-view>
        <div ui-view="view2"></div>
        `;
        fs.outputFileSync(path.join(__dirname, '../fixtures/temp/src/components/application', 'application.html'), content);
        createGenerator();
        yeomanTest.mockPrompt(gen, { target: 'view2' });
        gen.run(function () {
            const filesToTest = testUtil.getFilesToTest(stateFiles, 'index')
                .concat('./src/components/application/application.html');
            yeomanAssert.fileContent(path.resolve('src/components/index-state/index-route.js'),
                /views: {\n.*view2: {/);
            yeomanAssert.file(filesToTest);
            testUtil.assertOnlyFiles(filesToTest, done);
        });
    });
});
