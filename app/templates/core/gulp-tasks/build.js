/*eslint-disable */
'use strict';
/*eslint-enable */

module.exports = (gulp) => {
    gulp.task('build', [
        'copy-static',
        'compile-source',
        'compile-stylesheets'
    ]);
};
