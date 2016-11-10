const _ = require('lodash');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.development');

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

// config.module.rules = [
//     {
//         test: /\.js$/,
//         loader: 'isparta',
//         exclude: [
//             /node_modules/,
//             /-spec\.js$/
//         ],
//         query: {
//             embedSource: true,
//             noAutoWrap: true,
//             babel: {
//                 presets: ['es2015', 'stage-2']
//             }
//         }
//     },
//     {
//         test: /-spec\.js$/,
//         loader: 'babel-loader',
//         exclude: [
//             /node_modules/
//         ]
//     },
//     {
//         test: /\.js$/,
//         loader: 'babel-loader'
//     },
//     {
//         test: /\.html$/,
//         loader: 'raw'
//     },
//     {
//         test: /\.json$/,
//         loader: 'json'
//     },
//     {
//         test: /sinon\.js$/,
//         loader: 'imports?define=>false,require=>false'
//     }
// ];
//
// config.plugins.push(new webpack.NormalModuleReplacementPlugin(/^\.\/package$/, (result) => {
//     if (/cheerio/.test(result.context)) {
//         result.request = './package.json'; // eslint-disable-line no-param-reassign
//     }
// }));

module.exports = config;
