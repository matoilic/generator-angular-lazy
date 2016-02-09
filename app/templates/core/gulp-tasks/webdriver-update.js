/*eslint-disable */
'use strict';
/*eslint-enable */

const protractor = require('gulp-protractor');

module.exports = (gulp) => {
    gulp.task('webdriver-update', (done) => {
        const browsers = ['chrome'];

        if (process.platform === 'win32') {
            browsers.push('ie');
        } else if (process.platform === 'darwin') {
            browsers.push('safari');
        }

        protractor.webdriver_update({ browsers: browsers }, done);
    });
};
