const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackConfigProd = require('../config/webpack-production');

module.exports = gulp => gulp.task('compile-source', ['eslint'], (callback) => {
    webpack(webpackConfigProd, (err, stats) => {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }

        gutil.log('[webpack]', stats.toString());

        callback();
    });
});
