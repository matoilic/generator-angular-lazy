'use strict';

const eslint = require('gulp-eslint');

module.exports = (gulp, config) => {
    gulp.task('eslint', () => {
        return gulp
            .src(config.paths.scripts.concat(config.paths.configs))
            .pipe(eslint())
            .pipe(eslint.format());
    });
};
