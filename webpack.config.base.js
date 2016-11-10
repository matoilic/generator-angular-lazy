const path = require('path');

module.exports = {
    entry: {
        application: [
            path.join(__dirname, 'src', 'index.js')
        ]
    },
    resolve: {
        extensions: ['.js'],
        modules: [
            'node_modules'
        ],
        alias: {}
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'build'),
        chunkFilename: '[name].chunk.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel?compact=false',
                exclude: [
                    /-spec\.js$/
                ]
            },
            {
                test: /\.html$/,
                loader: 'raw'
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    },
    plugins: [
    ],
    externals: {},
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
    watch: false
};
