'use strict';

const connect = require('gulp-connect');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');
const webpackConfigDev = require('../webpack.config.development');

module.exports = (gulp, config) => {
    gulp.task('serve', ['copy-static', 'compile-stylesheets'], () => {
        const compiler = webpack(webpackConfigDev);

        connect.server({
            port: config.serverPort,
            livereload: config.livereload,
            root: [
                config.paths.build.output
            ],
            middleware: con => [
                con().use(webpackDevMiddleware(compiler, {
                    noInfo: false,
                    publicPath: webpackConfigDev.output.publicPath,
                    hot: true,
                    inline: true,
                    historyApiFallback: true,
                    stats: 'minimal'
                })),
                con().use(webpackHotMiddleware(compiler))
            ]
        });
    });
};
