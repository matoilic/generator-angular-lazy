module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: __dirname + '/../',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jspm', 'jasmine'],

        // list of files / patterns to load in the browser
        files: [],

        jspm: {
            baseURL: '/base/build/',
            config: 'config/systemjs.conf.js',
            loadFiles: [
                'build/**/*-spec.js'
            ],
            serveFiles: [
                'build/**/*.*',
                'jspm_packages/**/*.js',
                'jspm_packages/**/*.css'
            ]
        },

        proxies: {
            '/base/components/': '/base/build/components/',
            '/node_modules/': '/base/node_modules/',
            '/jspm_packages/': '/base/jspm_packages/'
        },


        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: { },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS', 'Chrome', 'Firefox'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        coverageReporter: {
            type: 'html',
            dir: __dirname + '/../test-coverage'
        }
    });
};
