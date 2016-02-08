'use strict';

module.exports = (gulp, config) => {
    gulp.task('copy-static', function () {
        return gulp
            .src(config.paths.static.concat(config.paths.html))
            .pipe(gulp.dest(config.paths.build.output));
    });
};
