/*eslint-disable */
'use strict';
/*eslint-enable */

const assert = require('yeoman-assert');
const fs = require('fs-extra');
const stateFileExpectations = require('./expectations/state');
const stateI18nFileExpectations = require('./expectations/state-i18n');
const stateGenerator = require('./generators/state');
const disableI18n = require('./utils/disable-i18n');

describe('State generator', () => {
    const parentStateName = 'mock-parent';
    const mockSimpleParent = () => {
        fs.outputFileSync(`src/components/${parentStateName}-state/${parentStateName}-state.html`, `
            <div>
                <ui-view></ui-view>
            </div>
        `);
    };
    const mockMultiViewParent = () => {
        fs.outputFileSync(`src/components/${parentStateName}-state/${parentStateName}-state.html`, `
            <div>
                <ui-view name="view1"></ui-view>
                <div ui-view="view2"></div>
            </div>
        `);
    };

    it('generates the state structure', (done) => {
        stateGenerator.run('custom', null, () => {
            assert.file(stateFileExpectations('custom'));
            assert.file(stateI18nFileExpectations('custom'));

            done();
        });
    });

    it('generates the state structure in a subdirectory', (done) => {
        const prefix = 'subdir';

        stateGenerator.run('custom', { prefix }, () => {
            const files = stateFileExpectations('custom', `${prefix}/`);
            const i18nFiles = stateI18nFileExpectations('custom', `${prefix}/`);

            assert.file(files);
            assert.file(i18nFiles);

            done();
        });
    });

    it('updates the states configuration', (done) => {
        stateGenerator.run('custom', null, () => {
            const statesFile = fs.readFileSync(stateGenerator.statesFile);
            const states = JSON.parse(statesFile.toString());

            expect(states[0].name).toEqual('app.custom');

            done();
        });
    });

    it('excludes i18n when told so', (done) => {
        stateGenerator.run('custom', null, () => {
            assert.file(stateFileExpectations('custom'));
            assert.noFile(stateI18nFileExpectations('custom'));

            done();
        }, disableI18n);
    });

    it('accepts a custom url option', (done) => {
        const url = 'custom-url/:id';

        stateGenerator.run('custom', { url }, () => {
            const routeConfig = fs.readFileSync('src/components/custom-state/custom-route.js');

            expect(routeConfig).toMatch(`'${url}'`);

            done();
        });
    });

    it('accepts a custom parent route', (done) => {
        stateGenerator.run(`${parentStateName}.custom`, null, () => {
            const routeConfig = fs
                .readFileSync(`src/components/${parentStateName}-custom-state/${parentStateName}-custom-route.js`);

            expect(routeConfig).toMatch(`'app.${parentStateName}.custom'`);

            done();
        }, mockSimpleParent);
    });

    it('handles parents with multiple views properly', (done) => {
        const target = 'view2';

        stateGenerator.run(`${parentStateName}.custom`, null, () => {
            const routeConfig = fs
                .readFileSync(`src/components/${parentStateName}-custom-state/${parentStateName}-custom-route.js`);

            expect(routeConfig).toMatch(`views: {\n                ${target}: {`);

            done();
        }, mockMultiViewParent, { target });
    });
});
