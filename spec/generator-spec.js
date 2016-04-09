// "strict": [2, "never"]
'use strict';

const appGenerator = require('./generators/app');
const childProcess = require('child_process');
const EslintCliEngine = require('eslint').CLIEngine;
const fs = require('fs-extra');
const npmCheck = require('npm-check');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1200000;

describe('Overall generator', () => {
    it('generates code which passes all ESLint specs', (done) => {
        appGenerator.run(null, { i18n: true, bootstrapJs: true, bootstrapCss: true }, () => {
            const outputConfig = ['ignore', 'ignore', 'pipe'];

            childProcess.execSync('yo angular-lazy:component custom', {
                cwd: appGenerator.testDirectory,
                stdio: outputConfig
            });

            childProcess.execSync('yo angular-lazy:directive custom', {
                cwd: appGenerator.testDirectory,
                stdio: outputConfig
            });

            childProcess.execSync('yo angular-lazy:state custom --force', {
                cwd: appGenerator.testDirectory,
                stdio: outputConfig
            });

            const cli = new EslintCliEngine({
                cwd: appGenerator.testDirectory
            });

            const report = cli.executeOnFiles(['.']);

            expect(report.errorCount).toEqual(0);
            expect(report.warningCount).toEqual(0);

            done();
        });
    });

    it('has no outdated dependencies', (done) => {
        appGenerator.run(null, { i18n: true, bootstrapJs: true, bootstrapCss: true }, () => {
            childProcess.execSync('npm install --silent --yes', {
                cwd: appGenerator.testDirectory
            });

            npmCheck({ skipUnused: true, cwd: appGenerator.testDirectory }).then((report) => {
                const packages = report.get('packages');
                const outdated = packages.filter((p) => p.installed !== p.latest);

                expect(outdated).toEqual([]);

                done();
            });
        });
    });

    afterEach((done) => fs.emptyDir(appGenerator.testDirectory, () => done()));
});
