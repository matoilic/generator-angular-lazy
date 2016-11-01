'use strict';

const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const embedTemplates = require('gulp-angular-embed-templates');

module.exports = (gulp, config) => {
    gulp.task('compile-source', () => gulp
        .src(config.paths.sources)
        .pipe(embedTemplates())
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: [
                'es2015',
                'stage-2'
            ]
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.paths.build.output))
    );
};
