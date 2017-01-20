/* eslint-disable no-console */

const appConfig = require('../config/application');
const chalk = require('chalk');
const path = require('path');
const spawn = require('cross-spawn');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfigDev = require('../config/webpack-development');

const compiler = webpack(webpackConfigDev);

compiler.plugin('invalid', () => {
    console.log(chalk.cyan('Compiling...'));
});

compiler.plugin('done', (stats) => {
    const hasWarnings = stats.compilation.warnings.length > 0;
    const hasErrors = stats.compilation.errors.length > 0;
    const isSuccessful = !hasErrors && !hasWarnings;

    if (hasErrors) {
        process.exit(1);
    } else if (hasWarnings) {
        console.log(chalk.yellow('Compiled with warnings!'));
    } else if (isSuccessful) {
        console.log(chalk.green('Compiled successfully!'));
    }

    setImmediate(() => {
        console.log();
        console.log(chalk.cyan('Starting tests...'));
        console.log();

        const args = process.argv.slice(process.argv.indexOf(__filename) + 1);
        args.unshift(path.resolve(__dirname, '..', 'config', 'protractor.js'));

        const testProcess = spawn(
            require.resolve('protractor/bin/protractor'),
            args,
            { stdio: 'inherit' }
        );

        testProcess.on('close', (code) => {
            process.exit(code);
        });
    });
});

console.log();
console.log(chalk.yellow('Firefox newer that 47 is currently not supported by Selenium.'));
console.log();

console.log();
console.log(chalk.cyan('Installing webdriver...'));
console.log();

spawn.sync(
    require.resolve('webdriver-manager/bin/webdriver-manager'),
    ['update', '--standalone'],
    { stdio: 'inherit' }
);

console.log();
console.log(chalk.cyan('Starting server...'));
console.log();

const devServer = new WebpackDevServer(compiler, {
    contentBase: appConfig.paths.appBuild,
    publicPath: webpackConfigDev.output.publicPath,
    watchOptions: {
        ignored: /node_modules/
    },
    host: appConfig.server.host,
    port: appConfig.server.port,
    hot: false,
    inline: true,
    stats: 'minimal'
});

devServer.listen(appConfig.server.port);
