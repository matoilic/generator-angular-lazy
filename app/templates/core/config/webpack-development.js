const webpack = require('webpack');
const baseConfig = require('./webpack-base');
const _ = require('lodash');

const config = _.merge({}, baseConfig);

config.output.filename = '[name].js';
config.output.publicPath = '/';

const appEntry = config.entry.application;
appEntry.unshift('webpack/hot/only-dev-server');
appEntry.unshift('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true');

config.plugins.push(
    new webpack.DefinePlugin({
        __DEV__: true,
        'process.env': {
            NODE_ENV: JSON.stringify('development')
        }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
        minimize: false,
        debug: true
    })
);

config.devtool = 'eval-source-map';

module.exports = config;
