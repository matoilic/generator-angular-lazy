const appGenerator = require('./app');
const fs = require('fs-extra');
const helpers = require('yeoman-test');
const path = require('path');

const statesFile = 'src/components/application/config/states.json';

function run(name, options, runner, setup, prompts) {
    helpers
        .run(path.join(__dirname, '..', '..', 'state'))
        .inDir(appGenerator.testDirectory, () => {
            fs.copySync(
                path.join(__dirname, '..', 'files', 'yo-rc.json'),
                path.join(appGenerator.testDirectory, '.yo-rc.json')
            );

            fs.outputFileSync(statesFile, '[]');

            setup && setup();
        })
        .withArguments(['--force', name])
        .withOptions(options || {})
        .withPrompts(prompts || {})
        .on('end', function () {
            runner();
        })
}

module.exports = {
    statesFile,
    run
};
