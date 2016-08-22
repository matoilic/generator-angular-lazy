'use strict';

const protractor = require('gulp-protractor');

module.exports = (gulp) => {
    gulp.task('webdriver-standalone', protractor.webdriver_standalone);
};
