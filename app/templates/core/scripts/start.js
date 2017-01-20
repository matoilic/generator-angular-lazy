/* eslint-disable no-console */

const appConfig = require('../config/application');
const chalk = require('chalk');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const webpackConfigDev = require('../config/webpack-development');

const compiler = webpack(webpackConfigDev);
let isFirstCompile = true;

compiler.plugin('invalid', () => {
    console.log();
    console.log(chalk.cyan('Compiling...'));
    console.log();
});

compiler.plugin('done', (stats) => {
    setImmediate(() => {
        const hasWarnings = stats.compilation.warnings.length > 0;
        const isSuccessful = !stats.compilation.errors.length && !hasWarnings;
        const showInstructions = isFirstCompile && isSuccessful;

        if (isSuccessful) {
            console.log();
            console.log(chalk.green('Compiled successfully!'));
        } else if (hasWarnings) {
            console.log();
            console.log(chalk.yellow('Compiled with warnings!'));
        }

        if (showInstructions) {
            console.log();
            console.log('The app is running at:');
            console.log();
            console.log(chalk.cyan(`${appConfig.server.protocol}://${appConfig.server.host}:${appConfig.server.port}`).toString());
            console.log();

            isFirstCompile = false;
        }
    });
});

console.log(chalk.cyan('Starting server...'));
console.log();

const devServer = new WebpackDevServer(compiler, {
    contentBase: appConfig.paths.appBuild,
    publicPath: '/',
    watchOptions: {
        ignored: /node_modules/
    },
    host: appConfig.server.host,
    hot: false,
    https: appConfig.server.protocol === 'https',
    inline: true,
    stats: 'minimal'
});

devServer.listen(appConfig.server.port);
