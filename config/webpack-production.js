const _ = require('lodash');
const baseConfig = require('./webpack-base');
const appConfig = require('./application');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const path = require('path');
const webpack = require('webpack');

const config = _.merge({}, baseConfig);

config.output.filename = 'js/[name].[chunkhash:8].js';
config.output.chunkFilename = 'js/[name].[chunkhash:8].chunk.js';
config.output.publicPath = appConfig.publicPath;

config.module.rules.pop();
config.module.rules.pop();

config.module.rules.push({
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: [
            {
                loader: 'css-loader'
            },
            {
                loader: 'postcss-loader',
                query: {
                    config: __dirname
                }
            }
        ]
    })
});

config.module.rules.push({
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: [
            {
                loader: 'css-loader'
            },
            {
                loader: 'postcss-loader',
                query: {
                    config: __dirname
                }
            },
            {
                loader: 'sass-loader',
                options: {
                    includePaths: [
                        path.resolve(__dirname, '../node_modules/bootstrap-sass/assets/stylesheets')
                    ]
                }
            }
        ]
    })
});

config.plugins.push(
    new ExtractTextPlugin('css/[name].[contenthash:8].css'),
    new webpack.DefinePlugin({
        __DEV__: false,
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            screw_ie8: true,
            warnings: false
        },
        mangle: {
            screw_ie8: true
        },
        output: {
            comments: false,
            screw_ie8: true
        }
    }),
    new ManifestPlugin({
        fileName: 'asset-manifest.json'
    })
);

module.exports = config;
