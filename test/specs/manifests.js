/*eslint-disable */
'use strict';
/*eslint-enable */
/* eslint-disable no-console, no-use-before-define, space-in-parens */
/**
 * Test for:
 * Manifests files and packages install
 * Some parts of this test process was based and inspired in the one used in:
 * https://github.com/angular-fullstack/generator-angular-fullstack
 */
const path = require('path');
const yeomanAssert = require('yeoman-assert');
const testUtil = require('../lib/util');
//
describe('Angular Lazy: manifests', function () {
    const fixturesPkgJson = '../fixtures/package.json';
    const fixturesNodeModules = '../fixtures/node_modules';
    const fixturesJspmPackages = '../fixtures/jspm_packages';

    function getArrayDependencies(deps) {
        const aDeps = [];
        for ( const key in deps ) {
            if ({}.hasOwnProperty.call(deps, key)) {
                aDeps.push(deps[key].replace(':', '/').split('@')[0].concat('@'));
            }
        }
        return aDeps;
    }

    function testForPackageJSON() {
        yeomanAssert.file([
            path.join(__dirname, fixturesPkgJson)
        ]);
    }

    it('>should have package.json in fixtures', function () {
        testForPackageJSON();
    });
    it('>should have all npm packages in fixtures/node_modules', function () {
        testForPackageJSON();
        const packageJson = require(fixturesPkgJson);
        let deps = [].concat(
            Object.keys(packageJson.dependencies),
            Object.keys(packageJson.devDependencies)
        );
        deps = deps.map(function (dep) {
            return path.join(__dirname, fixturesNodeModules, dep);
        });
        yeomanAssert.file(deps);
    });
    it('>should have all jspm packages in fixtures/jspm_packages', function () {
        testForPackageJSON();
        const packageJson = require(fixturesPkgJson);
        const deps = []
            .concat(getArrayDependencies(packageJson.jspm.dependencies))
            .concat(getArrayDependencies(packageJson.jspm.devDependencies));
        const allDirPaths = testUtil.getDirTree(path.join(__dirname, fixturesJspmPackages));
        let count = 0;
        deps.forEach(function (item) {
            count += allDirPaths.find((pathToLook) => {
                return pathToLook.indexOf(item) > -1;
            }) === undefined ? 0 : 1;
        });
        yeomanAssert.ok(count === deps.length);
    });
});
