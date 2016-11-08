const _ = require('lodash');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.development');

const config = _.merge({}, baseConfig);

config.devtool = 'inline-source-map';
delete config.entry.application;
delete config.output;

config.resolve.alias.sinon = 'sinon/pkg/sinon';

_.merge(config.externals, {
    jsdom: 'window'
});

config.module.rules = [
    {
        test: /\.js$/,
        loader: 'isparta',
        exclude: [
            /node_modules/,
            /\.spec\.js$/
        ]
    },
    {
        test: /\.spec\.js?$/,
        loader: 'babel-loader',
        exclude: [
            /node_modules/
        ]
    },
    {
        test: /\.js?$/,
        loader: 'babel-loader'
    },
    {
        test: /\.html$/,
        loader: 'raw'
    },
    {
        test: /\.json$/,
        loader: 'json'
    },
    {
        test: /sinon\.js$/,
        loader: 'imports?define=>false,require=>false'
    }
];

config.plugins.push(new webpack.NormalModuleReplacementPlugin(/^\.\/package$/, (result) => {
    if (/cheerio/.test(result.context)) {
        result.request = './package.json'; // eslint-disable-line no-param-reassign
    }
}));

config.isparta = {
    embedSource: true,
    noAutoWrap: true
};

config.devtool = 'inline-source-map';

module.exports = config;
