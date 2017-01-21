const path = require('path');

function resolve(filename) {
    return path.join(__dirname, '..', filename);
}

module.exports = {
    server: {
        host: 'localhost',
        port: 8088,
        protocol: 'http'
        // proxy: {
        //     '/api': 'http://example.com',
        //     '/other-api': 'http://example.com'
        // }
    },
    paths: {
        appBuild: resolve('build'),
        appHtml: resolve('src/index.html'),
        appIndexJs: resolve('src/index.js'),
        appTestIndexJs: resolve('src/index.test.js'),
        appPackageJson: resolve('package.json'),
        appSrc: resolve('src'),
        e2eTests: resolve('src/**/*-test.js')
    },
    publicPath: '/'
};
