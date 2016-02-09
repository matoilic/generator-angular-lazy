/*eslint-disable */
'use strict';
/*eslint-enable */

const protractor = require('gulp-protractor');

module.exports = (gulp) => {
    gulp.task('webdriver-standalone', protractor.webdriver_standalone);
};
