const assert = require('yeoman-assert');
const path = require('path');
const fs = require('fs-extra');
const appGenerator = require('./generators/app');
const appFileExpectations = require('./expectations/app');
const appI18nFileExpectations = require('./expectations/app-i18n');
const stateFileExpectations = require('./expectations/state');

describe('App generator', () => {
    it('generates the application structure', (done) => {
        appGenerator.run(null, null, () => {
            assert.file(appFileExpectations());
            assert.file(appI18nFileExpectations());
            assert.file(stateFileExpectations(appGenerator.defaultOptions.indexRouteName));

            const states = fs.readFileSync('src/components/application/config/states.js').toString();

            expect(states).toContain(`name: 'app.${appGenerator.defaultOptions.indexRouteName}'`);

            done();
        });
    });

    it('generates the application structure with a root option', (done) => {
        const root = 'custom-root';

        appGenerator.run({ root }, null, () => {
            const coreFiles = appFileExpectations().map((p) => path.join(root, p));
            const i18nFiles = appI18nFileExpectations().map((p) => path.join(root, p));
            const stateFiles = stateFileExpectations(appGenerator.defaultOptions.indexRouteName)
                .map((p) => path.join(root, p));

            assert.file(coreFiles);
            assert.file(i18nFiles);
            assert.file(stateFiles);

            done();
        });
    });

    it('includes i18n when told so', (done) => {
        appGenerator.run(null, { i18n: true }, () => {
            assert.file(appI18nFileExpectations());

            const packageFile = fs.readFileSync('package.json');
            const packageDefinition = JSON.parse(packageFile.toString());

            expect(packageDefinition.dependencies['angular-translate']).toBeTruthy();

            done();
        });
    });

    it('excludes i18n when told so', (done) => {
        appGenerator.run(null, { i18n: false }, () => {
            assert.file(appFileExpectations());
            assert.noFile(appI18nFileExpectations());

            const packageFile = fs.readFileSync('package.json');
            const packageDefinition = JSON.parse(packageFile.toString());

            expect(packageDefinition.dependencies['angular-translate']).not.toBeTruthy();

            done();
        });
    });

    it('includes angular-ui-bootstrap when told so', (done) => {
        appGenerator.run(null, { bootstrapJs: true }, () => {
            const packageFile = fs.readFileSync('package.json');
            const packageDefinition = JSON.parse(packageFile.toString());

            expect(packageDefinition.dependencies['angular-ui-bootstrap']).toBeTruthy();

            done();
        });
    });

    it('excludes angular-ui-bootstrap when told so', (done) => {
        appGenerator.run(null, { bootstrapJs: false }, () => {
            const packageFile = fs.readFileSync('package.json');
            const packageDefinition = JSON.parse(packageFile.toString());

            expect(packageDefinition.dependencies['angular-ui-bootstrap']).not.toBeTruthy();

            done();
        });
    });

    it('includes bootstrap-sass when told so', (done) => {
        appGenerator.run(null, { bootstrapCss: true }, () => {
            const packageFile = fs.readFileSync('package.json');
            const packageDefinition = JSON.parse(packageFile.toString());

            expect(packageDefinition.devDependencies['bootstrap-sass']).toBeTruthy();

            done();
        });
    });

    it('excludes bootstrap-sass when told so', (done) => {
        appGenerator.run(null, { bootstrapCss: false }, () => {
            const packageFile = fs.readFileSync('package.json');
            const packageDefinition = JSON.parse(packageFile.toString());

            expect(packageDefinition.devDependencies['bootstrap-sass']).not.toBeTruthy();

            done();
        });
    });

    it('saves the passed options', (done) => {
        appGenerator.run(null, null, () => {
            const yoFile = fs.readFileSync('.yo-rc.json');
            const yoConfig = JSON.parse(yoFile.toString())['generator-angular-lazy'];

            expect(yoConfig).toEqual(appGenerator.defaultOptions);

            done();
        });
    });
});
