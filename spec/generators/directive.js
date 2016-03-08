const appGenerator = require('./app');
const fs = require('fs-extra');
const helpers = require('yeoman-test');
const path = require('path');

function run(name, options, runner, setup) {
    helpers
        .run(path.join(__dirname, '..', '..', 'directive'))
        .inDir(appGenerator.testDirectory, () => {
            fs.copySync(
                path.join(__dirname, '..', 'files', 'yo-rc.json'),
                path.join(appGenerator.testDirectory, '.yo-rc.json')
            );

            if (setup) {
                setup();
            }
        })
        .withArguments(['--force', name])
        .withOptions(options || {})
        .on('end', () => {
            runner();
        });
}

module.exports = {
    run
};
