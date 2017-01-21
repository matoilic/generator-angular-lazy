const appGenerator = require('./generators/app');
const EslintCliEngine = require('eslint').CLIEngine;
const fs = require('fs-extra');
const npmCheck = require('npm-check');
const semver = require('semver');
const spawn = require('cross-spawn');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1200000;

const bootstrap = () => {
    const params = ['install', '--yes'];
    const result = spawn.sync('npm', params, {
        cwd: appGenerator.testDirectory
    });

    if (result.status !== 0) {
        throw new Error(
            `"npm ${params.join(' ')}" failed with exit code ${result.status}. \n${result.stderr.toString()}`
        );
    }
};

describe('Overall generator', () => {
    beforeAll((done) => {
        appGenerator.run(null, { i18n: true, bootstrapJs: true, bootstrapCss: true }, () => {
            bootstrap();

            const yo = require.resolve('yo/lib/cli.js');
            const processConfig = {
                cwd: appGenerator.testDirectory,
                stdio: ['ignore', 'ignore', 'pipe']
            };

            const commands = [
                [yo, 'angular-lazy:component', 'custom'],
                [yo, 'angular-lazy:directive', 'custom'],
                [yo, 'angular-lazy:state', 'custom', '--force']
            ];

            commands.forEach((command) => {
                const result = spawn.sync('node', command, processConfig);

                if (result.status !== 0) {
                    throw new Error(
                        `"${command.join(' ')}" failed with exit code ${result.status}. \n${result.stderr.toString()}`
                    );
                }
            });

            done();
        });
    });

    afterAll(done => fs.emptyDir(appGenerator.testDirectory, () => done()));

    it('generates code which passes all ESLint specs', () => {
        const cli = new EslintCliEngine({
            cwd: appGenerator.testDirectory
        });

        const report = cli.executeOnFiles(['.']);

        expect(report.errorCount).toEqual(0);
        expect(report.warningCount).toEqual(0);
    });

    it('has no outdated dependencies', (done) => {
        npmCheck({ skipUnused: true, cwd: appGenerator.testDirectory }).then((report) => {
            const packages = report.get('packages');
            const outdated = packages.filter(p => semver.lt(p.installed, p.latest));

            expect(outdated).toEqual([]);

            done();
        });
    });

    it('starts the development server', () => {
        const result = spawn.sync('npm', ['start', '--', '--smoke-test'], {
            cwd: appGenerator.testDirectory,
            stdio: ['ignore', 'ignore', 'pipe']
        });

        expect(result.status).toBe(0);
    });

    it('builds the application', () => {
        const result = spawn.sync('npm', ['run', 'build'], {
            cwd: appGenerator.testDirectory,
            stdio: ['ignore', 'ignore', 'pipe']
        });

        expect(result.status).toBe(0);
    });
});
