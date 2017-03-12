'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.serverLauncher = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Environment settings
var _process$env = process.env,
    _process$env$OUTPUT_D = _process$env.OUTPUT_DIR,
    OUTPUT_DIR = _process$env$OUTPUT_D === undefined ? './dist' : _process$env$OUTPUT_D,
    _process$env$DEV_SERV = _process$env.DEV_SERVER_HOST,
    DEV_SERVER_HOST = _process$env$DEV_SERV === undefined ? 'localhost' : _process$env$DEV_SERV,
    _process$env$DEV_SERV2 = _process$env.DEV_SERVER_PORT,
    DEV_SERVER_PORT = _process$env$DEV_SERV2 === undefined ? 3000 : _process$env$DEV_SERV2,
    _process$env$API_PROT = _process$env.API_PROTOCOL,
    API_PROTOCOL = _process$env$API_PROT === undefined ? 'http' : _process$env$API_PROT,
    _process$env$API_HOST = _process$env.API_HOST,
    API_HOST = _process$env$API_HOST === undefined ? 'localhost' : _process$env$API_HOST,
    _process$env$API_PORT = _process$env.API_PORT,
    API_PORT = _process$env$API_PORT === undefined ? 8080 : _process$env$API_PORT,
    _process$env$API_SUBD = _process$env.API_SUBDOMAIN,
    API_SUBDOMAIN = _process$env$API_SUBD === undefined ? '' : _process$env$API_SUBD,
    _process$env$PUBLIC_P = _process$env.PUBLIC_PATH,
    PUBLIC_PATH = _process$env$PUBLIC_P === undefined ? '/' : _process$env$PUBLIC_P;


var API_ROOT = process.env.API_ROOT ? process.env.API_ROOT : API_PROTOCOL + '://' + API_HOST + ':' + API_PORT + '/' + API_SUBDOMAIN;

/*****************************************
********* Webpack dev server *************
******************************************/

var defaultServerConfig = {
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
    contentBase: _path2.default.resolve(process.cwd(), OUTPUT_DIR),
    proxy: { // By default, proxy all request different from built files, to the API
        '*': API_ROOT
    }
};

var serverLauncher = exports.serverLauncher = function serverLauncher(webpackConfig) {
    var serverConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    new _webpackDevServer2.default((0, _webpack2.default)(webpackConfig), (0, _lodash.defaultsDeep)(serverConfig, defaultServerConfig)).listen(DEV_SERVER_PORT, DEV_SERVER_HOST, function (err) {
        if (err) {
            console.error(err);
        }
        console.log('Webpack dev server listening at %s:%s', DEV_SERVER_HOST, DEV_SERVER_PORT);
    });
};