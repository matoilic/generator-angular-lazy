const connect = require('gulp-connect');

module.exports = (gulp) => {
    gulp.task('reload', () => gulp
        .src('src/index.html')
        .pipe(connect.reload())
    );
};
