const connect = require('gulp-connect');
const protractor = require('gulp-protractor');

module.exports = (gulp, config) => {
    gulp.task('test-e2e', ['build', 'webdriver-update'], (done) => {
        connect.server({
            port: config.serverPortTest,
            root: ['build']
        });

        gulp
            .src(`${config.paths.build.output}/**/*-test.js`)
            .pipe(protractor.protractor({
                configFile: `${__dirname}/../config/protractor.js`
            }))
            .on('error', (err) => {
                connect.serverClose();

                throw err;
            })
            .on('end', () => {
                connect.serverClose();

                done();
            });
    });
};
