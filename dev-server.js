import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { defaultsDeep } from 'lodash';

// Environment settings
const {
    OUTPUT_DIR = './dist',              // Output directory
    DEV_SERVER_HOST = 'localhost',      // Dev server hostname
    DEV_SERVER_PORT = 3000,             // Dev server port
    API_PROTOCOL = 'http',              // API protocol
    API_HOST = 'localhost',             // API hostname
    API_PORT = 8080,                    // API port
    API_SUBDOMAIN = '',                 // API subdomain
    PUBLIC_PATH = '/'                   // Output public path
} = process.env;

const API_ROOT = process.env.API_ROOT ? process.env.API_ROOT : `${API_PROTOCOL}://${API_HOST}:${API_PORT}/${API_SUBDOMAIN}`;

/*****************************************
********* Webpack dev server *************
******************************************/

const defaultServerConfig = {
    publicPath: PUBLIC_PATH,
    hot: true,
    stats: {
        colors: true,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: true,
        errorDetails: true,
        warnings: true
    },
    historyApiFallback: true,
    contentBase: path.resolve(process.cwd(), OUTPUT_DIR),
    proxy: {                                                    // By default, proxy all request different from built files, to the API
        '*': API_ROOT
    }
};

export const serverLauncher = (webpackConfig, serverConfig = {}) => {
    new WebpackDevServer(webpack(webpackConfig), defaultsDeep(serverConfig, defaultServerConfig)).listen(DEV_SERVER_PORT, DEV_SERVER_HOST, err => {
        if (err) {
            console.error(err);
        }
        console.log('Webpack dev server listening at %s:%s', DEV_SERVER_HOST, DEV_SERVER_PORT);
    });
};
