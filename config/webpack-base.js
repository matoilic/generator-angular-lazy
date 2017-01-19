const appConfig = require('./application');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    devtool: 'cheap-module-source-map',

    entry: {
        application: [
            appConfig.paths.appIndexJs
        ]
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {}
    },
    output: {
        pathinfo: true,
        filename: '[name].js',
        path: appConfig.paths.appBuild,
        chunkFilename: '[name].chunk.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                exclude: [
                    /\.html$/,
                    /\.js$/,
                    /\.css$/,
                    /\.scss$/,
                    /\.json$/,
                    /\.svg$/
                ],
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'assets/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.svg$/,
                loader: 'file-loader',
                query: {
                    name: 'assets/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: 'src'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: appConfig.paths.appSrc,
                query: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            // Keep css and scss loader last. They are replaced for production builds.
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
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
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
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
            }
        ]
    },
    plugins: [
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            inject: true,
            template: appConfig.paths.appHtml
        })
    ],
    externals: {},
    stats: {
        colors: true
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};
