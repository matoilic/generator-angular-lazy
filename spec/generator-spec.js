// "strict": [2, "never"]
'use strict';

const appGenerator = require('./generators/app');
const childProcess = require('child_process');
const EslintCliEngine = require('eslint').CLIEngine;
const fs = require('fs-extra');
const npmCheck = require('npm-check');
const semver = require('semver');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1200000;

describe('Overall generator', () => {
    it('generates code which passes all ESLint specs', (done) => {
        appGenerator.run(null, { i18n: true, bootstrapJs: true, bootstrapCss: true }, () => {
            const processConfig = {
                cwd: appGenerator.testDirectory,
                stdio: ['ignore', 'ignore', 'pipe']
            };

            childProcess.execSync('yo angular-lazy:component custom', processConfig);
            childProcess.execSync('yo angular-lazy:directive custom', processConfig);
            childProcess.execSync('yo angular-lazy:state custom --force', processConfig);

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
                const outdated = packages.filter((p) => semver.lt(p.installed, p.latest));

                expect(outdated).toEqual([]);

                done();
            });
        });
    });

    afterEach((done) => fs.emptyDir(appGenerator.testDirectory, () => done()));
});
