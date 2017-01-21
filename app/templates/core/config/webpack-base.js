const appConfig = require('./application');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
                include: appConfig.paths.appSrc
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
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
                        loader: 'sass-loader'
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
