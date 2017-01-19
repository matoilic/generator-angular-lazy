/* eslint-disable no-console */

const chalk = require('chalk');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack-production');

function printErrors(summary, errors) {
    console.log(chalk.red(summary));
    console.log();
    errors.forEach(err => {
        console.log(err.message || err);
        console.log();
    });
}

const compiler = webpack(webpackConfig);

console.log('Creating an optimized production build...');

compiler.run((err, stats) => {
    if (err) {
        printErrors('Failed to compile.', [err]);
        process.exit(1);
    }

    if (stats.compilation.errors.length) {
        printErrors('Failed to compile.', stats.compilation.errors);
        process.exit(1);
    }

    console.log(chalk.green('Compiled successfully.'));
    console.log();
    console.log(`The ${chalk.cyan('build')} folder is ready to be deployed.`);
    console.log();
});
