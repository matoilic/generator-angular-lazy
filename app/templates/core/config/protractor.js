var protractorBase = __dirname + '/../node_modules/protractor/';
var webdriverVersions = require(protractorBase + 'config.json').webdriverVersions;

var capabilities = [
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

if(process.platform === 'win32') {
    capabilities.push({
        browserName: 'internet explorer',
        platform: 'ANY',
        version: '11'
    });
} else if(process.platform === 'darwin') {
    capabilities.push({
        browserName: 'safari'
    });
}

module.exports.config = {
    multiCapabilities: capabilities,
    seleniumServerJar: protractorBase + 'selenium/selenium-server-standalone-' + webdriverVersions.selenium + '.jar',
    baseUrl: 'http://localhost:8089/index.html',
    rootElement: '#applicationContainer',
    framework: 'jasmine2',
    specs: ['../build/**/*-test.js'],
    maxSessions: 1,
    jasmineNodeOpts: {
        defaultTimeoutInterval: 360000
    },
    onPrepare: function() {
        //this is required because we manually bootstrap angular
        browser.manage().timeouts().pageLoadTimeout(400000);
        browser.manage().timeouts().implicitlyWait(250000);
        browser.ignoreSynchronization = true;
    }
}