const _ = require('lodash');
const appConfig = require('./application');
const baseConfig = require('./webpack-base');
const webpack = require('webpack');

const config = _.merge({}, baseConfig);

config.output.filename = '[name].js';
config.output.publicPath = '/';

const appEntry = config.entry.application;
appEntry.unshift('webpack/hot/only-dev-server');
appEntry.unshift(`webpack-dev-server/client?${appConfig.server.protocol}://${appConfig.server.host}:${appConfig.server.port}`);

config.plugins.push(
    new webpack.DefinePlugin({
        __DEV__: true,
        'process.env': {
            NODE_ENV: JSON.stringify('development')
        }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
);

config.devtool = 'cheap-module-source-map';

module.exports = config;
