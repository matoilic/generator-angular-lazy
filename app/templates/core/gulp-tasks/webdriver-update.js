const protractor = require('gulp-protractor');

module.exports = (gulp) => {
    gulp.task('webdriver-update', (done) => {
        const browsers = ['chrome'];

        if (process.platform === 'win32') {
            browsers.push('ie', 'edge');
        } else if (process.platform === 'darwin') {
            browsers.push('safari');
        }

        protractor.webdriver_update({ browsers }, done);
    });
};
