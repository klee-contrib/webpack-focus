import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {defaultsDeep} from 'lodash/object';
import path from 'path';

// Environment settings
const {
    DEV = true,
    DEV_SERVER_HOST = 'localhost',
    DEV_SERVER_PORT = 3000,
    ENTRY_FILE_PATH = './src',
    OUTPUT_FILE_NAME = 'your-project-name',
    PROJECT_NAME = 'your-project',
    OUTPUT_DIR = './dist',
    PAGE_TITLE = 'You project landing page',
    ANCHOR_CLASS = 'your-project',
    PUBLIC_PATH = '/',
    GENERATE_HTML = true,
    BASE_DIR = __dirname,
    BABELIFIED_PATH = './src'
} = process.env;

/*************************************
********* Webpack config *************
**************************************/
const defaultConfig = {
    entry: [
        ENTRY_FILE_PATH
    ].concat(DEV ? [
        `webpack-dev-server/client?http://${DEV_SERVER_HOST}:${DEV_SERVER_PORT}`,
        'webpack/hot/only-dev-server'
    ] : []),
    output: {
        path: path.resolve(BASE_DIR, OUTPUT_DIR),
        filename: `${OUTPUT_FILE_NAME}.js`,
        publicPath: PUBLIC_PATH,
        libraryTarget: 'umd',
        library: PROJECT_NAME
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: DEV ? 'true' : 'false',
            __ANCHOR_CLASS__: DEV ? JSON.stringify(ANCHOR_CLASS) : null
        })
    ].concat(DEV ? [
        new webpack.HotModuleReplacementPlugin()
    ] : [
        
    ]).concat(GENERATE_HTML ? [
        new HtmlWebpackPlugin({
            inject: 'body',
            templateContent: `<html><head><title>${PAGE_TITLE}</title></head><body><div class="${ANCHOR_CLASS}"/></body></html>`
        })
    ] : []),
    progress: true,
    module: {
        loaders: [
            {
                test: /.js?$/,
                loader: DEV ? 'react-hot!babel' : 'babel',
                include: [
                    path.resolve(BASE_DIR, BABELIFIED_PATH)
                ]
            },
            {
                test: /\.json$/,
                loaders: ['json']
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.css$/,
                loader: 'style!css'
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

export const configBuilder = (customConf = {}) => defaultsDeep(defaultConfig, customConf);
