module.exports = (gulp) => {
    gulp.task('build', [
        'copy-static',
        'compile-source',
        'compile-stylesheets'
    ]);
};
