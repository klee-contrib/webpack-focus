'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.configBuilder = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _webpack = require('webpack-focus/require')('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _htmlWebpackPlugin = require('webpack-focus/require')('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _extractTextWebpackPlugin = require('webpack-focus/require')('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _lodash = require('webpack-focus/require')('lodash');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var USER = _os2.default.hostname();

// Environment settings
var _process$env = process.env,
    _process$env$DEV = _process$env.DEV,
    DEV = _process$env$DEV === undefined ? 'true' : _process$env$DEV,
    _process$env$DEV_SERV = _process$env.DEV_SERVER_HOST,
    DEV_SERVER_HOST = _process$env$DEV_SERV === undefined ? 'localhost' : _process$env$DEV_SERV,
    _process$env$DEV_SERV2 = _process$env.DEV_SERVER_PORT,
    DEV_SERVER_PORT = _process$env$DEV_SERV2 === undefined ? 3000 : _process$env$DEV_SERV2,
    _process$env$ENTRY_FI = _process$env.ENTRY_FILE_PATH,
    ENTRY_FILE_PATH = _process$env$ENTRY_FI === undefined ? './src' : _process$env$ENTRY_FI,
    _process$env$npm_pack = _process$env.npm_package_name,
    npm_package_name = _process$env$npm_pack === undefined ? 'your-project' : _process$env$npm_pack,
    _process$env$OUTPUT_D = _process$env.OUTPUT_DIR,
    OUTPUT_DIR = _process$env$OUTPUT_D === undefined ? './dist' : _process$env$OUTPUT_D,
    _process$env$PAGE_TIT = _process$env.PAGE_TITLE,
    PAGE_TITLE = _process$env$PAGE_TIT === undefined ? 'You project landing page' : _process$env$PAGE_TIT,
    _process$env$ANCHOR_C = _process$env.ANCHOR_CLASS,
    ANCHOR_CLASS = _process$env$ANCHOR_C === undefined ? 'your-project' : _process$env$ANCHOR_C,
    _process$env$PUBLIC_P = _process$env.PUBLIC_PATH,
    PUBLIC_PATH = _process$env$PUBLIC_P === undefined ? '/' : _process$env$PUBLIC_P,
    _process$env$GENERATE = _process$env.GENERATE_HTML,
    GENERATE_HTML = _process$env$GENERATE === undefined ? 'true' : _process$env$GENERATE,
    _process$env$BABELIFI = _process$env.BABELIFIED_PATH,
    BABELIFIED_PATH = _process$env$BABELIFI === undefined ? './src' : _process$env$BABELIFI,
    _process$env$MINIMIFY = _process$env.MINIMIFY,
    MINIMIFY = _process$env$MINIMIFY === undefined ? 'false' : _process$env$MINIMIFY,
    _process$env$LIBRARY_ = _process$env.LIBRARY_NAME,
    LIBRARY_NAME = _process$env$LIBRARY_ === undefined ? 'YourProject' : _process$env$LIBRARY_,
    _process$env$SOURCE_M = _process$env.SOURCE_MAPS,
    SOURCE_MAPS = _process$env$SOURCE_M === undefined ? 'true' : _process$env$SOURCE_M,
    _process$env$DEBUG = _process$env.DEBUG,
    DEBUG = _process$env$DEBUG === undefined ? 'true' : _process$env$DEBUG,
    _process$env$PACKAGE_ = _process$env.PACKAGE_JSON_PATH,
    PACKAGE_JSON_PATH = _process$env$PACKAGE_ === undefined ? './' : _process$env$PACKAGE_,
    OUTPUT_PUBLIC_PATH = _process$env.OUTPUT_PUBLIC_PATH,
    BROWSERS = _process$env.BROWSERS,
    _process$env$DROP_CON = _process$env.DROP_CONSOLE,
    DROP_CONSOLE = _process$env$DROP_CON === undefined ? 'false' : _process$env$DROP_CON;
// Parse json settings

DEV = JSON.parse(DEV);
GENERATE_HTML = JSON.parse(GENERATE_HTML);
MINIMIFY = JSON.parse(MINIMIFY);
DROP_CONSOLE = JSON.parse(DROP_CONSOLE);
SOURCE_MAPS = JSON.parse(SOURCE_MAPS);
DEBUG = JSON.parse(DEBUG);
OUTPUT_PUBLIC_PATH = OUTPUT_PUBLIC_PATH !== undefined ? OUTPUT_PUBLIC_PATH : 'http://' + DEV_SERVER_HOST + ':' + DEV_SERVER_PORT + '/';
BABELIFIED_PATH = BABELIFIED_PATH.split(',');
var babelifiedIncludes = BABELIFIED_PATH.map(function (relativePath) {
    return _path2.default.resolve(process.cwd(), relativePath.trim());
});
/*************************************
********* Webpack config *************
**************************************/
var defaultConfig = function defaultConfig(definedVariables) {
    return {
        entry: [_path2.default.resolve(process.cwd(), ENTRY_FILE_PATH)].concat(DEV ? [// In dev mode, add hot reloading
        'webpack-dev-server/client?http://' + DEV_SERVER_HOST + ':' + DEV_SERVER_PORT, 'webpack/hot/only-dev-server'] : []),
        output: {
            path: _path2.default.resolve(process.cwd(), OUTPUT_DIR),
            publicPath: OUTPUT_PUBLIC_PATH,
            filename: npm_package_name + '.js', // Generated file will hold the package name
            libraryTarget: 'umd',
            library: LIBRARY_NAME
        },
        devtool: SOURCE_MAPS ? 'source-map' : false,
        debug: DEBUG,
        stats: { // Sets webpack to quieter setting, to leave a clean console on build
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
        plugins: [new _webpack2.default.DefinePlugin(_extends({ // Define several global variables to be used in the project
            __DEV__: DEV ? 'true' : 'false',
            __ANCHOR_CLASS__: JSON.stringify(ANCHOR_CLASS),
            __PACKAGE_JSON_PATH__: JSON.stringify(PACKAGE_JSON_PATH),
            __USER__: JSON.stringify(USER),
            __PROJECT__: JSON.stringify(npm_package_name)
        }, definedVariables)), new _webpack2.default.optimize.DedupePlugin(), new _extractTextWebpackPlugin2.default(npm_package_name + '.css') // Generated a CSS file
        ].concat(DEV ? [new _webpack2.default.HotModuleReplacementPlugin()] : []).concat(GENERATE_HTML ? [new _htmlWebpackPlugin2.default({
            inject: 'body',
            templateContent: '<html>\n    <head>\n        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>\n        <meta charset="UTF-8">\n        <title>' + PAGE_TITLE + '</title>\n    </head>\n    <body>\n        <div class="' + ANCHOR_CLASS + '"/>\n    </body>\n</html>'
        })] : []).concat(MINIMIFY ? [new _webpack2.default.optimize.UglifyJsPlugin({
            compressor: {
                screw_ie8: true,
                warnings: false,
                drop_console: DROP_CONSOLE,
                drop_debugger: true,
                passes: 2
            }
        })] : []),
        resolve: {
            extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
        },
        module: {
            preLoaders: [{
                test: /\.js$/,
                loader: require.resolve('source-map-loader')
            }],
            loaders: [{
                test: /\.(js|jsx)$/,
                loader: require.resolve('webpack-alternate-require-loader'),
                include: babelifiedIncludes,
                query: JSON.stringify({
                    'webpack-focus/require': require.resolve('webpack-focus/require')
                })
            }, {
                test: /\.(js|jsx)$/,
                loader: require.resolve('babel-loader'),
                include: babelifiedIncludes,
                query: {
                    presets: [require.resolve('babel-preset-focus')],
                    plugins: [['replace-require', {
                        DEV_ARCHETYPE: "require('webpack-focus/require')"
                    }]]
                }
            }, {
                test: /\.json$/,
                loaders: [require.resolve('json-loader')]
            }, {
                test: /\.scss$/,
                loader: _extractTextWebpackPlugin2.default.extract(require.resolve('style-loader'), require.resolve('css-loader') + '!' + require.resolve('postcss-loader') + ('' + (BROWSERS ? '?{browsers:' + JSON.stringify(BROWSERS.split(',')) + '}' : '')) + '!' + require.resolve('sass-loader'))
            }, {
                test: /\.css$/,
                loader: _extractTextWebpackPlugin2.default.extract(require.resolve('style-loader'), require.resolve('css-loader'), require.resolve('postcss-loader') + ('' + (BROWSERS ? '?{browsers:' + JSON.stringify(BROWSERS.split(',')) + '}' : '')))
            }, {
                test: /\.png(\?.*)?$/,
                loader: require.resolve('url-loader'),
                query: { mimetype: 'image/png' }
            }, {
                test: /\.jpg(\?.*)?$/,
                loader: require.resolve('url-loader'),
                query: { mimetype: 'image/jpg' }
            }, {
                test: /\.gif(\?.*)?$/,
                loader: require.resolve('url-loader'),
                query: { mimetype: 'image/gif' }
            }, {
                test: /\.ttf(\?.*)?$/,
                loader: require.resolve('url-loader'),
                query: { limit: 50000, mimetype: 'application/octet-stream' }
            }, {
                test: /\.eot(\?.*)?$/,
                loader: require.resolve('file-loader')
            }, {
                test: /\.woff2(\?.*)?$/,
                loader: require.resolve('url-loader'),
                query: { limit: 50000, mimetype: 'application/font-woff' }
            }, {
                test: /\.woff(\?.*)?$/,
                loader: require.resolve('base64-font-loader')
            }, {
                test: /\.svg(\?.*)?$/,
                loader: require.resolve('url-loader'),
                query: { limit: 50000, mimetype: 'image/svg+xml' }
            }]
        }
    };
};

var configBuilder = exports.configBuilder = function configBuilder() {
    var customConf = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var definedVariables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return (0, _lodash.defaultsDeep)(customConf, defaultConfig(definedVariables));
};