const webpack = require('webpack');
const baseConfig = require('./webpack-base');
const _ = require('lodash');

const config = _.merge({}, baseConfig);

config.output.publicPath = '';

config.plugins.push(
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }),
    new webpack.DefinePlugin({
        __DEV__: false,
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            screw_ie8: true
        },
        output: {
            comments: false
        },
        sourceMap: true
    })
);

module.exports = config;
