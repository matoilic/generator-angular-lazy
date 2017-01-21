/* eslint-disable no-console */

const appConfig = require('../config/application');
const chalk = require('chalk');
const httpProxyMiddleware = require('http-proxy-middleware');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const webpackConfigDev = require('../config/webpack-development');

function onProxyRequest(proxy) {
    return (proxyReq /* , req, res */) => {
        // Browers may send Origin headers even with same-origin
        // requests. To prevent CORS issues, we have to change
        // the Origin to match the target URL.
        if (proxyReq.getHeader('origin')) {
            proxyReq.setHeader('origin', proxy);
        }
    };
}

// We need to provide a custom onError function for httpProxyMiddleware.
// It allows us to log custom error messages on the console.
function onProxyError(proxy) {
    return (err, req, res) => {
        const host = req.headers && req.headers.host;

        console.log(
            `${chalk.red('Proxy error:')} Could not proxy request ${chalk.cyan(req.url)}` +
            ` from ${chalk.cyan(host)} to ${chalk.cyan(proxy)}.`
        );

        console.log(
            'See https://nodejs.org/api/errors.html#errors_common_system_errors for more information' +
            ` (${chalk.cyan(err.code)}).`
        );

        console.log();

        // And immediately send the proper error response to the client.
        // Otherwise, the request will eventually timeout with ERR_EMPTY_RESPONSE on the client side.
        if (res.writeHead && !res.headersSent) {
            res.writeHead(500);
        }

        res.end(`Proxy error: Could not proxy request ${req.url} from ${host} to ${proxy} (${err.code}).`);
    };
}

const isSmokeTest = process.argv.includes('--smoke-test');
let handleCompile;
if (isSmokeTest) {
    handleCompile = (err, stats) => {
        if (err || stats.hasErrors() || stats.hasWarnings()) {
            process.exit(1);
        } else {
            process.exit(0);
        }
    };
}

const compiler = webpack(webpackConfigDev, handleCompile);
let isFirstCompile = true;

compiler.plugin('invalid', () => {
    console.log();
    console.log(chalk.cyan('Compiling...'));
    console.log();
});

compiler.plugin('done', (stats) => {
    setImmediate(() => {
        const hasWarnings = stats.compilation.warnings.length > 0;
        const isSuccessful = !stats.compilation.errors.length && !hasWarnings;
        const showInstructions = isFirstCompile && isSuccessful;

        if (isSuccessful) {
            console.log();
            console.log(chalk.green('Compiled successfully!'));
        } else if (hasWarnings) {
            console.log();
            console.log(chalk.yellow('Compiled with warnings!'));
        }

        if (showInstructions) {
            console.log();
            console.log('The app is running at:');
            console.log();
            console.log(chalk.cyan(`${appConfig.server.protocol}://${appConfig.server.host}:${appConfig.server.port}`).toString());
            console.log();

            isFirstCompile = false;
        }
    });
});

console.log(chalk.cyan('Starting server...'));
console.log();

const devServer = new WebpackDevServer(compiler, {
    contentBase: appConfig.paths.appBuild,
    publicPath: '/',
    watchOptions: {
        ignored: /node_modules/
    },
    host: appConfig.server.host,
    hot: false,
    https: appConfig.server.protocol === 'https',
    inline: true,
    stats: 'minimal'
});

if (appConfig.server.proxy) {
    if (typeof appConfig.server.proxy !== 'object') {
        console.log(chalk.red('When specified, "proxy" in config/application.js must be an object.'));
        console.log(chalk.red(`Instead, the type of "proxy" was "${typeof appConfig.server.proxy}".`));
        console.log(chalk.red('Either remove "proxy" from config/application.js, or make it an object.'));
        console.log(chalk.red('Example:'));
        console.log(chalk.red("proxy: {\n    '/api': 'http://example.com'\n}"));

        process.exit(1);
    }

    const proxy = appConfig.server.proxy;
    const uris = Object.keys(proxy);
    let hpm;

    uris.forEach((uri) => {
        hpm = httpProxyMiddleware(uri, {
            target: proxy[uri],
            logLevel: 'silent',
            onProxyReq: onProxyRequest(proxy[uri]),
            onError: onProxyError(proxy[uri]),
            secure: false,
            changeOrigin: true,
            ws: true
        });

        devServer.use(uri, hpm);
    });

    if (hpm) {
        // Listen for the websocket 'upgrade' event and upgrade the connection.
        // If this is not done, httpProxyMiddleware will not try to upgrade until
        // an initial plain HTTP request is made.
        devServer.listeningApp.on('upgrade', hpm.upgrade);
    }

    // Finally, by now we have certainly resolved the URL.
    // It may be /index.html, so let the dev server try serving it again.
    devServer.use(devServer.middleware);
}

devServer.listen(appConfig.server.port);
