'use strict';

const autoprefixer = require('gulp-autoprefixer');
const path = require('path');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

module.exports = (gulp, config) => {
    gulp.task('compile-stylesheets', () => {
        return gulp
            .src(config.paths.stylesheets)
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(sass({
                outputStyle: 'expanded',
                includePaths: [
                    path.resolve('src')<% if (bootstrapCss) { %>,
                    path.resolve('node_modules/bootstrap-sass/assets/stylesheets')<% } %>
                ]
             }))
            .pipe(autoprefixer())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.paths.build.output));
    });
};
