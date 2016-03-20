'use strict';

const assert = require('yeoman-assert');
const directiveFileExpectations = require('./expectations/directive');
const directiveI18nFileExpectations = require('./expectations/directive-i18n');
const directiveGenerator = require('./generators/directive');
const disableI18n = require('./utils/disable-i18n');

describe('Directive generator', () => {
    it('generates the directive structure', (done) => {
        directiveGenerator.run('custom', null, () => {
            assert.file(directiveFileExpectations('custom'));
            assert.file(directiveI18nFileExpectations('custom'));

            done();
        });
    });

    it('generates the directive structure in a subdirectory', (done) => {
        const prefix = 'subdir';

        directiveGenerator.run('custom', { prefix }, () => {
            const files = directiveFileExpectations('custom', `${prefix}/`);
            const i18nFiles = directiveI18nFileExpectations('custom', `${prefix}/`);

            assert.file(files);
            assert.file(i18nFiles);

            done();
        });
    });

    it('excludes i18n when told so', (done) => {
        directiveGenerator.run('custom', null, () => {
            assert.file(directiveFileExpectations('custom'));
            assert.noFile(directiveI18nFileExpectations('custom'));

            done();
        }, disableI18n);
    });
});
