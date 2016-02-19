'use strict';
const path = require('path');
const fs = require('fs-extra');
const yeomanAssert = require('yeoman-assert');

describe('making sure test fixtures are present', function () {
    let allDirPaths = [];

    function getArrayDependencies(deps) {
        let adeps = [];
        for (const key in deps) {
            adeps.push(deps[key].replace(':', '/').split('@')[0].concat('@'));
        }
        return adeps;
    }
    function getDirTree(home, thePath) {
        allDirPaths.push(thePath
            .replace(home,'')
            .replace(/\\/g, '/')
            .slice(1));
        let files = fs.readdirSync(thePath);
        files.forEach(function(item){
            if (fs.lstatSync(path.join(thePath,item)).isDirectory()) {
                getDirTree(home, path.join(thePath,item));
            }
        });
    }
    function testForPackageJSON() {
        yeomanAssert.file([
            path.join(__dirname, '..', 'fixtures', 'package.json')
        ]);
    }
    it('>should have package.json in fixtures', function () {
        testForPackageJSON();
    });
    it('>should have all npm packages in fixtures/node_modules', function () {
        testForPackageJSON();
        const packageJson = require('../fixtures/package.json');

        let deps = [].concat(
            Object.keys(packageJson.dependencies),
            Object.keys(packageJson.devDependencies)
        );
        deps = deps.map(function (dep) {
            return path.join(__dirname, '..', 'fixtures', 'node_modules', dep);
        });
        yeomanAssert.file(deps);
    });
    it('>should have all jspm packages in fixtures/jspm_packages', function () {
        testForPackageJSON();
        const packageJson = require('../fixtures/package.json');

        let home = path.join(__dirname, '..', 'fixtures', 'jspm_packages');
        let deps = []
            .concat(getArrayDependencies(packageJson.jspm.dependencies))
            .concat(getArrayDependencies(packageJson.jspm.devDependencies));

        getDirTree(home, home);

        let count = 0;
        deps.forEach(function(item){
            count += allDirPaths.find((pathToLook) => {return pathToLook.indexOf(item) > -1;}) === undefined? 0: 1;
        });

        yeomanAssert.ok(count === deps.length);
    });
});



