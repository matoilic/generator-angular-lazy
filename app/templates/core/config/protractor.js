require('babel-core/register');

const appConfig = require('./application');
const path = require('path');

const webdriverPath = path.join(
    path.dirname(require.resolve('webdriver-manager')),
    '..',
    '..'
);

const webdriverVersions = require(`${webdriverPath}/config.json`).webdriverVersions;

const capabilities = [
    {
        browserName: 'chrome',
        chromeOptions: {
            args: ['no-sandbox']
        }
    },
    {
        browserName: 'firefox'
    }
];

if (process.platform === 'win32') {
    capabilities.push({
        browserName: 'internet explorer',
        platform: 'ANY',
        version: '11'
    });
} else if (process.platform === 'darwin') {
    capabilities.push({
        browserName: 'safari'
    });
}

module.exports.config = {
    multiCapabilities: capabilities,
    seleniumServerJar: `${webdriverPath}/selenium/selenium-server-standalone-${webdriverVersions.selenium}.jar`,
    baseUrl: `${appConfig.server.protocol}://${appConfig.server.host}:${appConfig.server.port}/#`,
    rootElement: '#applicationContainer',
    framework: 'jasmine2',
    specs: [appConfig.paths.e2eTests],
    maxSessions: 1,
    jasmineNodeOpts: {
        defaultTimeoutInterval: 360000
    }
};
