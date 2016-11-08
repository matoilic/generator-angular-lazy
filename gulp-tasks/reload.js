'use strict';

const connect = require('gulp-connect');

module.exports = (gulp) => {
    gulp.task('reload', () => gulp
        .src('index.html')
        .pipe(connect.reload())
    );
};
