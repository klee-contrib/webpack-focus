'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var API_PROTOCOL = process.env.API_PROTOCOL || 'http';
var API_HOST = process.env.API_HOST || 'localhost';
var API_PORT = process.env.API_PORT || 8080;
var API_SUBDOMAIN = process.env.API_SUBDOMAIN || '';

var LEGACY_SEARCH_API = process.env.LEGACY_SEARCH_API ? JSON.parse(process.env.LEGACY_SEARCH_API) : false;
var BASE_URL = process.env.BASE_URL ? JSON.stringify(process.env.BASE_URL) : '';
var NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';

// Check if focus libraries should be held locally or read from NPM
var localFocus = process.env.LOCAL_FOCUS ? JSON.parse(process.env.LOCAL_FOCUS) : false;

var customConfig = localFocus ? {
    resolve: {
        alias: {
            'focus-core': _path2.default.resolve(process.cwd(), '../focus-core'),
            'focus-components': _path2.default.resolve(process.cwd(), '../focus-components'),
            moment: _path2.default.resolve(process.cwd(), './node_modules/moment'),
            numeral: _path2.default.resolve(process.cwd(), './node_modules/numeral'),
            react: _path2.default.resolve(process.cwd(), './node_modules/react')
        }
    }
} : {};

var globals = {
    __API_ROOT__: JSON.stringify(process.env.API_ROOT ? process.env.API_ROOT : API_PROTOCOL + '://' + API_HOST + ':' + API_PORT + '/' + API_SUBDOMAIN),
    __LEGACY_SEARCH_API__: JSON.stringify(LEGACY_SEARCH_API),
    __BASE_URL__: BASE_URL,
    'process.env.NODE_ENV': '\'' + NODE_ENV + '\''
};

exports.default = (0, _index.configBuilder)(customConfig, globals);
module.exports = exports['default'];