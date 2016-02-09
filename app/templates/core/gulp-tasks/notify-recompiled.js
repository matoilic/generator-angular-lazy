/*eslint-disable */
'use strict';
/*eslint-enable */

const connect = require('gulp-connect');
const notify = require('gulp-notify');

module.exports = (gulp, config) => {
    gulp.task('notify-recompiled', () => {
        let task = gulp.src('index.html');

        if (config.livereload) {
            task = task.pipe(connect.reload());
        }

        if (config.notifications) {
            task = task.pipe(notify('recompiled changed files'));
        }

        return task;
    });
};
