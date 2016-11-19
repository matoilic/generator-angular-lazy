const assert = require('yeoman-assert');
const fs = require('fs-extra');
const componentFileExpectations = require('./expectations/component');
const componentI18nFileExpectations = require('./expectations/component-i18n');
const componentGenerator = require('./generators/component');
const disableI18n = require('./utils/disable-i18n');

describe('Component generator', () => {
    it('generates the component structure', (done) => {
        componentGenerator.run('custom', null, () => {
            assert.file(componentFileExpectations('custom'));
            assert.file(componentI18nFileExpectations('custom'));

            done();
        });
    });

    it('generates the component structure in a subdirectory', (done) => {
        const prefix = 'subdir';

        componentGenerator.run('custom', { prefix }, () => {
            const files = componentFileExpectations('custom', `${prefix}/`);
            const i18nFiles = componentI18nFileExpectations('custom', `${prefix}/`);

            assert.file(files);
            assert.file(i18nFiles);

            done();
        });
    });

    it('excludes i18n when told so', (done) => {
        componentGenerator.run('custom', null, () => {
            assert.file(componentFileExpectations('custom'));
            assert.noFile(componentI18nFileExpectations('custom'));

            done();
        }, disableI18n);
    });

    it('installs the stylesheet', (done) => {
        componentGenerator.run('custom', null, () => {
            const styles = fs.readFileSync('src/index.scss').toString();

            expect(styles).toContain('@import "components/custom/custom-component";');
            expect(styles).toContain('/* components:end */');

            done();
        });
    });
});
