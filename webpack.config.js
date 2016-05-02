import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import {defaultsDeep} from 'lodash/object';
import path from 'path';
import os from 'os';

import precss  from 'precss';
import autoprefixer from 'autoprefixer';
import stripInlineComments from 'postcss-strip-inline-comments';
import simpleVars from 'postcss-simple-vars';
import sassyMixins from 'postcss-sassy-mixins';
import postcssImport from 'postcss-import';
import calc from 'postcss-calc';
import conditionals from 'postcss-conditionals';

const USER = os.hostname();
let externalVariables = {};

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
    DEBUG = 'true',
    PACKAGE_JSON_PATH = './',
    OUTPUT_PUBLIC_PATH,
    BROWSERS,
    EXTERNAL_VARIABLES
} = process.env;
// Parse json settings
DEV = JSON.parse(DEV);
GENERATE_HTML = JSON.parse(GENERATE_HTML);
MINIMIFY = JSON.parse(MINIMIFY);
SOURCE_MAPS = JSON.parse(SOURCE_MAPS);
DEBUG = JSON.parse(DEBUG);
OUTPUT_PUBLIC_PATH = OUTPUT_PUBLIC_PATH !== undefined ? OUTPUT_PUBLIC_PATH : `http://${DEV_SERVER_HOST}:${DEV_SERVER_PORT}/`;

if(EXTERNAL_VARIABLES) {
  try {
    externalVariables = require(path.resolve(process.cwd(), EXTERNAL_VARIABLES));
  }catch(err) {
    console.error('Can not load external variables');
  }
} else {
  try {
    externalVariables = require('focus-components/style/external_variables.js');
  } catch(err) {
    console.error('Can not load external variables');
  }
}

/*************************************
********* Webpack config *************
**************************************/
const defaultConfig = definedVariables => ({
    entry: [
        path.resolve(process.cwd(), ENTRY_FILE_PATH)
    ].concat(DEV ? [
        `webpack-dev-server/client?http://${DEV_SERVER_HOST}:${DEV_SERVER_PORT}`,
        'webpack/hot/only-dev-server'
    ] : []),
    output: {
        path: path.resolve(process.cwd(), OUTPUT_DIR),
        publicPath: OUTPUT_PUBLIC_PATH,
        filename: `${npm_package_name}.js`,
        libraryTarget: 'umd',
        library: LIBRARY_NAME
    },
    devtool: SOURCE_MAPS ? 'source-map' : false,
    debug: DEBUG,
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
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: DEV ? 'true' : 'false',
            __ANCHOR_CLASS__: JSON.stringify(ANCHOR_CLASS),
            __PACKAGE_JSON_PATH__: JSON.stringify(PACKAGE_JSON_PATH),
            __USER__: JSON.stringify(USER),
            __PROJECT__: JSON.stringify(npm_package_name),
            ...definedVariables
        }),
        new webpack.optimize.DedupePlugin(),
        new ExtractTextPlugin(`${npm_package_name}.css`)
    ].concat(DEV ? [
        new webpack.HotModuleReplacementPlugin()
    ] : []).concat(GENERATE_HTML ? [
        new HtmlWebpackPlugin({
            inject: 'body',
            templateContent: `<html><head><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta charset="UTF-8"><title>${PAGE_TITLE}</title></head><body><div class="${ANCHOR_CLASS}"/></body></html>`
        })
    ] : []).concat(MINIMIFY ? [
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
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ],
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
                loader: ExtractTextPlugin.extract('css!postcss-loader?parser=postcss-scss')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css!postcss-loader')
            },
            {
                test: /\.png(\?.*)?$/,
                loader: 'url-loader',
                query: { mimetype: 'image/png' }
            },
            {
                test: /\.jpg(\?.*)?$/,
                loader: 'url-loader',
                query: { mimetype: 'image/jpg' }
            },
            {
                test: /\.gif(\?.*)?$/,
                loader: 'url-loader',
                query: { mimetype: 'image/gif' }
            },
            {
                test: /\.woff(\?.*)?$/,
                loader: 'url-loader',
                query: {limit: 50000, mimetype: 'application/font-woff'}
            },
            {
                test: /\.woff2(\?.*)?$/,
                loader: 'url-loader',
                query: {limit: 50000, mimetype: 'application/font-woff'}
            },
            {
                test: /\.ttf(\?.*)?$/,
                loader: 'url-loader',
                query: {limit: 50000, mimetype: 'application/octet-stream'}
            },
            {
                test: /\.eot(\?.*)?$/,
                loader: 'file'
            },
            {
                test: /\.svg(\?.*)?$/,
                loader: 'url-loader',
                query: {limit: 50000, mimetype: 'image/svg+xml'}
            }
        ]
    },
    postcss: function () {
      return [
        stripInlineComments,
        //Plugin to handle external variable
        simpleVars({
          //set Externals variables.
          variables: function () { return externalVariables;},
            //Set silent to left unknown variables in CSS and do not throw a error.
            silent: true
        }),
        postcssImport,
        sassyMixins,
        conditionals,
        calc,
        precss({
          "import": {
            "extension": "scss"
          }
        }),
        autoprefixer({ browsers: ['last 2 versions']})];
    }
});

export const configBuilder = (customConf = {}, definedVariables = {}) => defaultsDeep(customConf, defaultConfig(definedVariables));
