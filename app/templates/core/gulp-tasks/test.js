const KarmaServer = require('karma').Server;

module.exports = (gulp) => {
    gulp.task('test', (done) => {
        new KarmaServer(
            {
                configFile: `${__dirname}/../config/karma.js`,
                singleRun: true
            },
            () => done()
        ).start();
    });
};
