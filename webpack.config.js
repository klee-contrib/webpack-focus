import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import {defaultsDeep} from 'lodash/object';
import path from 'path';

// Environment settings
let {
    DEV = 'true',
    DEV_SERVER_HOST = 'localhost',
    DEV_SERVER_PORT = 3000,
    ENTRY_FILE_PATH = './src',
    npm_package_name = 'your-project',
    OUTPUT_DIR = './dist',
    PAGE_TITLE = 'You project landing page',
    ANCHOR_CLASS = 'your-project',
    PUBLIC_PATH = '/',
    GENERATE_HTML = 'true',
    BABELIFIED_PATH = './src',
    MINIMIFY = 'false',
    LIBRARY_NAME = 'YourProject',
    SOURCE_MAPS = 'true',
    DEBUG = 'true'
} = process.env;
// Parse json settings
DEV = JSON.parse(DEV);
GENERATE_HTML = JSON.parse(GENERATE_HTML);
MINIMIFY = JSON.parse(MINIMIFY);
SOURCE_MAPS = JSON.parse(SOURCE_MAPS);
DEBUG = JSON.parse(DEBUG);

/*************************************
********* Webpack config *************
**************************************/
const defaultConfig = {
    entry: [
        path.resolve(process.cwd(), ENTRY_FILE_PATH)
    ].concat(DEV ? [
        `webpack-dev-server/client?http://${DEV_SERVER_HOST}:${DEV_SERVER_PORT}`,
        'webpack/hot/only-dev-server'
    ] : []),
    output: {
        path: path.resolve(process.cwd(), OUTPUT_DIR),
        filename: `${npm_package_name}.js`,
        libraryTarget: 'umd',
        library: LIBRARY_NAME
    },
    devtool: SOURCE_MAPS ? 'source-map' : false,
    debug: DEBUG,
    stats: {
        colors: true,
        reasons: true
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: DEV ? 'true' : 'false',
            __ANCHOR_CLASS__: DEV ? JSON.stringify(ANCHOR_CLASS) : null
        }),
        new ExtractTextPlugin(`${npm_package_name}.css`)
    ].concat(DEV ? [
        new webpack.HotModuleReplacementPlugin()
    ] : []).concat(GENERATE_HTML ? [
        new HtmlWebpackPlugin({
            inject: 'body',
            templateContent: `<html><head><title>${PAGE_TITLE}</title></head><body><div class="${ANCHOR_CLASS}"/></body></html>`
        })
    ] : []).concat(MINIMIFY ? [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                'screw_ie8': true,
                warnings: false
            }
        })
    ] : []),
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: DEV ? 'react-hot!babel' : 'babel',
                include: [
                    path.resolve(process.cwd(), BABELIFIED_PATH)
                ]
            },
            {
                test: /\.json$/,
                loaders: ['json']
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css!sass')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.png$/,
                loader: 'url-loader',
                query: { mimetype: 'image/png' }
            },
            {
                test: /\.jpg$/,
                loader: 'url-loader',
                query: { mimetype: 'image/jpg' }
            },
            {
                test: /\.gif$/,
                loader: 'url-loader',
                query: { mimetype: 'image/gif' }
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=image/svg+xml'
            }
        ]
    }
}

export const configBuilder = (customConf = {}) => defaultsDeep(customConf, defaultConfig);
