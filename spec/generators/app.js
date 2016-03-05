const helpers = require('yeoman-test');
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

const testDirectory = path.join(__dirname, '..', '..', 'tmp');
const defaultOptions = {
    appName: 'Application Generator Test',
    i18n: true,
    locales: ['de', 'en', 'fr'],
    defaultLocale: 'en',
    bootstrapCss: true,
    bootstrapJs: true,
    indexRouteName: 'home',
    root: null
};

function run(options, prompts, runner, setup) {
    helpers
        .run(path.join(__dirname, '..', '..', 'app'))
        .inDir(testDirectory, () => {
            fs.copySync(
                path.join(__dirname, '..', 'files', 'package.json'),
                path.join(testDirectory, 'package.json')
            );

            fs.ensureDirSync(path.join(testDirectory, 'node_modules'));
            fs.ensureSymlinkSync(
                path.join(__dirname, '..', '..'),
                path.join(testDirectory, 'node_modules', 'generator-angular-lazy')
            );

            if (setup) {
                setup();
            }
        })
        .withArguments(['--force'])
        .withOptions(options || {})
        .withPrompts(_.merge({}, defaultOptions, prompts || {}))
        .on('end', function () {
            runner();
        });
}

module.exports = {
    testDirectory,
    defaultOptions,
    run
};
