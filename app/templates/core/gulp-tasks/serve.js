'use strict';

const connect = require('gulp-connect');

module.exports = (gulp, config) => {
    gulp.task('serve', ['build'], () => {
        connect.server({
            port: config.serverPort,
            livereload: config.livereload,
            root: ['.']
        });
    });
};
