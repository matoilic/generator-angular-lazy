const KarmaServer = require('karma').Server;

const singleRun = process.argv.indexOf('--watch') === -1;

new KarmaServer({
    configFile: `${__dirname}/../config/karma.js`,
    singleRun
}).start();
