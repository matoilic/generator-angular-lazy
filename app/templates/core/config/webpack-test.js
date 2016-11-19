const _ = require('lodash');
const baseConfig = require('./webpack-development');

const config = _.merge({}, baseConfig);

config.devtool = 'inline-source-map';
delete config.entry.application;
delete config.output;

_.merge(config.externals, {
    jsdom: 'window'
});

config.module.rules = [
    {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
            /node_modules/
        ]
    },
    {
        enforce: 'post',
        test: /\.js$/,
        loader: 'istanbul-instrumenter-loader',
        options: {
            compact: false,
            esModules: true,
            produceSourceMap: true
        },
        exclude: [
            /node_modules/,
            /-spec\.js$/,
            /-test\.js$/
        ]
    },
    {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
            compact: false,
            sourceMap: 'inline'
        }
    },
    {
        test: /\.html$/,
        loader: 'raw'
    },
    {
        test: /\.json$/,
        loader: 'json'
    }
];

module.exports = config;
