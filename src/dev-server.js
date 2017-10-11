import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import defaultsDeep from 'lodash/defaultsDeep';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import noopServiceWorkerMiddleware from 'react-dev-utils/noopServiceWorkerMiddleware';

import chalk from 'chalk';

import clearConsole from 'react-dev-utils/clearConsole';
import { choosePort, createCompiler, prepareUrls } from 'react-dev-utils/WebpackDevServerUtils';

import envParser from './webpack-utilities/env-parser';

// Environment settings
const parsedEnv = envParser(process.env);
const { OUTPUT_DIR, DEV_SERVER_PROTOCOL, DEV_SERVER_HOST, DEV_SERVER_PORT, OUTPUT_PUBLIC_PATH, npm_package_name } = parsedEnv;

/*****************************************
********* Webpack dev server *************
******************************************/
const isInteractive = process.stdout.isTTY;

const defaultServerConfig = {
    publicPath: OUTPUT_PUBLIC_PATH, // see https://webpack.js.org/configuration/dev-server/#devserver-publicpath-
    hot: true,
    watchOptions: {
        ignored: /node_modules/
    },
    clientLogLevel: 'info',
    watchContentBase: true,
    quiet: true,
    overlay: false,

    historyApiFallback: true,
    contentBase: path.resolve(process.cwd(), OUTPUT_DIR),
    // By default, proxy all request different from built files, to the API
    proxy: {
        // '**': API_ROOT
    },
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    setup(app) {
        // This lets us open files from the runtime error overlay.
        app.use(errorOverlayMiddleware());
        // This service worker file is effectively a 'no-op' that will reset any
        // previous service worker registered for the same host:port combination.
        // We do this in development to avoid hitting the production cache if
        // it used the same host and port.
        // https://github.com/facebookincubator/create-react-app/issues/2272#issuecomment-302832432
        app.use(noopServiceWorkerMiddleware());
    }

};


export const serverLauncher = (webpackConfig, serverConfig = {}) => {
    // We attempt to use the default port but if it is busy, we offer the user to
    // run on a different port. `detect()` Promise resolves to the next free port.
    choosePort(DEV_SERVER_HOST, DEV_SERVER_PORT)
        .then(port => {
            if (port === null) {
                // We have not found a port.
                return;
            }

            const urls = prepareUrls(DEV_SERVER_PROTOCOL, DEV_SERVER_HOST, port);
            // Create a webpack compiler that is configured with custom messages.
            const compiler = createCompiler(webpack, webpackConfig, npm_package_name, urls, false);

            const devServer = new WebpackDevServer(compiler, defaultsDeep(serverConfig, defaultServerConfig));
            // Launch WebpackDevServer.
            devServer.listen(port, DEV_SERVER_HOST, err => {
                if (err) {
                    return console.log(err);
                }
                if (isInteractive) {
                    clearConsole();
                }
                console.log(chalk.cyan('Starting the development server at %s:%s...\n'), DEV_SERVER_HOST, port);
                // openBrowser(urls.localUrlForBrowser);
            });

            ['SIGINT', 'SIGTERM'].forEach((sig) => {
                process.on(sig, () => {
                    devServer.close();
                    process.exit();
                });
            });
        })
        .catch(err => {
            if (err && err.message) {
                console.log(err.message);
            }
            process.exit(1);
        });
};
