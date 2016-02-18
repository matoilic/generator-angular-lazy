var gulp = require('gulp');
var mocha = require('gulp-mocha');
gulp.task('test', function () {
    return gulp.src('test/*_spec.js', { read: false })
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({ reporter: 'spec'/*'nyan'*/ }))
        .once('error', function () {
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});
