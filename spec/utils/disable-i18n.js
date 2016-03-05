const appGenerator = require('../generators/app');
const fs = require('fs-extra');
const path = require('path');

module.exports = function () {
    fs.copySync(
        path.join(__dirname, '..', 'files', 'yo-rc-no-i18n.json'),
        path.join(appGenerator.testDirectory, '.yo-rc.json')
    );
};
