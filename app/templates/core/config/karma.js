const webpackConfig = require('./webpack-test');

const browsers = ['Chrome', 'Firefox'];

if (process.platform === 'win32') {
    browsers.push('IE', 'Edge');
} else if (process.platform === 'darwin') {
    browsers.push('Safari');
}

module.exports = function (config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: `${__dirname}/../`,

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'source-map-support'],

        // list of files / patterns to load in the browser
        files: [
            'src/index.test.js'
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/index.test.js': ['coverage', 'webpack', 'sourcemap']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec', 'coverage', 'remap-coverage'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        coverageReporter: {
            type: 'in-memory'
        },

        remapCoverageReporter: {
            'text-summary': null,
            json: 'build/reports/coverage/coverage.json',
            html: 'build/reports/coverage/html'
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            stats: 'errors-only'
        }
    });
};
