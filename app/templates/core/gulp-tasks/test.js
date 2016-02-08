'use strict';

const KarmaServer = require('karma').Server;

module.exports = (gulp) => {
    gulp.task('test', ['build'], (done) => {
        new KarmaServer({
            configFile: __dirname + '/../config/karma.js',
            singleRun: true
        }, function () {
            done();
        }).start();
    });
};
