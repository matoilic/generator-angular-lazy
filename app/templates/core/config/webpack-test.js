const _ = require('lodash');
const baseConfig = require('./webpack-development');

const config = _.merge({}, baseConfig);

config.devtool = 'inline-source-map';

_.merge(config.externals, {
    jsdom: 'window'
});

config.module.rules.push(
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
    }
);

module.exports = config;
