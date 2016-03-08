/*eslint-disable */
'use strict';
/*eslint-enable */

const eslint = require('gulp-eslint');

module.exports = (gulp, config) => {
    gulp.task('eslint', () => gulp
        .src(config.paths.scripts.concat(config.paths.configs))
        .pipe(eslint())
        .pipe(eslint.format())
    );
};
