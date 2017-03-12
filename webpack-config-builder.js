import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { defaultsDeep } from 'lodash';
import path from 'path';
import os from 'os';

const USER = os.hostname();
// See https://webpack.js.org/guides/migrating/
// https://webpack.js.org/configuration/module/

// Environment settings
let {
    DEV = 'true',                               // Toggles the hot reloading
    DEV_SERVER_HOST = 'localhost',              // Dev server hostname
    DEV_SERVER_PORT = 3000,                     // Dev server port
    ENTRY_FILE_PATH = './src',                  // Entry file to build the application
    npm_package_name = 'your-project',          // Project name, automatically set by npm
    OUTPUT_DIR = './dist',                      // Output directory
    PAGE_TITLE = 'You project landing page',    // Generated HTML page title
    ANCHOR_CLASS = 'your-project',              // Generated HTML div's class
    GENERATE_HTML = 'true',                     // Toggle index.html auto generation
    BABELIFIED_PATH = './src',                  // Directory that will be babelified
    MINIMIFY = 'false',                         // Toggles sources minification
    LIBRARY_NAME = 'YourProject',               // Name of the bundled project, when set on the window (for brunch projects)
    SOURCE_MAPS = 'true',                       // Toggles source maps generation
    PACKAGE_JSON_PATH = './',                   // package.json path inside of focus packages, as seen from their root file
    OUTPUT_PUBLIC_PATH,                         // Output directory, as seen from the index.html
    HOT_RELOAD = 'true',                        // Flag to disable hot reload, even in DEV
    DROP_CONSOLE = 'false'                      // If console statement should be dropped when MINIMIFY
} = process.env;
// Parse json settings
DEV = JSON.parse(DEV);
HOT_RELOAD = JSON.parse(HOT_RELOAD);
GENERATE_HTML = JSON.parse(GENERATE_HTML);
MINIMIFY = JSON.parse(MINIMIFY);
DROP_CONSOLE = JSON.parse(DROP_CONSOLE);
SOURCE_MAPS = JSON.parse(SOURCE_MAPS);
OUTPUT_PUBLIC_PATH = OUTPUT_PUBLIC_PATH !== undefined ? OUTPUT_PUBLIC_PATH : `http://${DEV_SERVER_HOST}:${DEV_SERVER_PORT}/`;
BABELIFIED_PATH = BABELIFIED_PATH.split(',');
const babelifiedIncludes = BABELIFIED_PATH.map((relativePath) => {
    return path.resolve(process.cwd(), relativePath.trim());
});
/*************************************
********* Webpack config *************
**************************************/
const defaultConfig = definedVariables => ({
    entry: [
        path.resolve(process.cwd(), ENTRY_FILE_PATH)
    ].concat((DEV && HOT_RELOAD) ? [                                                    // In dev mode, add hot reloading
        `webpack-dev-server/client?http://${DEV_SERVER_HOST}:${DEV_SERVER_PORT}`,
        'webpack/hot/only-dev-server'
    ] : []),
    output: {
        path: path.resolve(process.cwd(), OUTPUT_DIR),
        publicPath: OUTPUT_PUBLIC_PATH,
        filename: `${npm_package_name}.js`,                                             // Generated file will hold the package name
        libraryTarget: 'umd',
        library: LIBRARY_NAME
    },
    devtool: SOURCE_MAPS ? 'source-map' : false,
    stats: {                                                                            // Sets webpack to quieter setting, to leave a clean console on build
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
        new webpack.DefinePlugin({                                                      // Define several global variables to be used in the project
            __DEV__: DEV ? 'true' : 'false',
            __ANCHOR_CLASS__: JSON.stringify(ANCHOR_CLASS),
            __PACKAGE_JSON_PATH__: JSON.stringify(PACKAGE_JSON_PATH),
            __USER__: JSON.stringify(USER),
            __PROJECT__: JSON.stringify(npm_package_name),
            ...definedVariables                                                         // Add user defined variables
        }),
        new ExtractTextPlugin(`${npm_package_name}.css`)                                // Generated a CSS file
    ].concat((DEV && HOT_RELOAD) ? [
        new webpack.HotModuleReplacementPlugin()
    ] : []).concat(GENERATE_HTML ? [
        new HtmlWebpackPlugin({
            inject: 'body',
            templateContent: `<html>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta charset="UTF-8">
        <title>${PAGE_TITLE}</title>
    </head>
    <body>
        <div class="${ANCHOR_CLASS}"/>
    </body>
</html>`
        })
    ] : []).concat(MINIMIFY ? [
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                screw_ie8: true,
                warnings: false,
                drop_console: DROP_CONSOLE,
                drop_debugger: true,
                passes: 2
            }
        })
    ] : []),
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                // Source map pre-loader
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader']
            },
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader'],
                include: babelifiedIncludes,
                options: {
                    presets: ['babel-preset-focus']
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader?importLoaders=1',
                        'postcss-loader', // Options should go into postcss.config.js
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader?importLoaders=1',
                        'postcss-loader' // Options should go into postcss.config.js
                    ]
                })
            },
            {
                test: /\.png(\?.*)?$/,
                rule: ['url-loader'],
                options: { mimetype: 'image/png' }
            },
            {
                test: /\.(jpg|jpeg)(\?.*)?$/,
                rule: 'url-loader',
                options: { mimetype: 'image/jpg' }
            },
            {
                test: /\.gif(\?.*)?$/,
                rule: 'url-loader',
                options: { mimetype: 'image/gif' }
            },
            {
                test: /\.ttf(\?.*)?$/,
                rule: 'url-loader',
                options: { limit: 50000, mimetype: 'application/octet-stream' }
            },
            {
                test: /\.eot(\?.*)?$/,
                rule: 'file-loader'
            },
            {
                test: /\.(woff2|woff)(\?.*)?$/,
                rule: 'url-loader',
                options: { limit: 50000, mimetype: 'application/font-woff' }
            },
            {
                test: /\.svg(\?.*)?$/,
                rule: 'url-loader',
                options: { limit: 50000, mimetype: 'image/svg+xml' }
            }
        ]
    }
});

export const configBuilder = (customConf = {}, definedVariables = {}) => defaultsDeep(customConf, defaultConfig(definedVariables));
