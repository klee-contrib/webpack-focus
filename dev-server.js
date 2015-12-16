import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

// Environment settings
const {
    OUTPUT_DIR = './dist',
    DEV_SERVER_HOST = 'localhost',
    DEV_SERVER_PORT = 3000,
    API_HOST = 'localhost',
    API_PORT = 8080,
    PUBLIC_PATH = '/',
    BASE_DIR = __dirname
} = process.env;

/*****************************************
********* Webpack dev server *************
******************************************/

const defaultServerConfig = {
    publicPath: PUBLIC_PATH,
    hot: true,
    stats: { colors: true },
    historyApiFallback: true,
    contentBase: path.resolve(BASE_DIR, OUTPUT_DIR),
    proxy: {
        '*': 'http://' + API_HOST + ':' + API_PORT
    }
};

export const serverLauncher = (webpackConfig, serverConfig = defaultServerConfig) => {
    new WebpackDevServer(webpack(webpackConfig), serverConfig).listen(DEV_SERVER_PORT, DEV_SERVER_HOST, err => {
        if (err) {
            console.error(err);
        }
        console.log('Webpack dev server listening at %s:%s', DEV_SERVER_HOST, DEV_SERVER_PORT);
    });
};
