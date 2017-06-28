'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { configBuilder } from './index';

var defaultConfig = function defaultConfig(environnement, definedVariables) {
    var config = (0, _base2.default)(environnement, definedVariables);

    var API_PROTOCOL = environnement.API_PROTOCOL || 'http';
    var API_HOST = environnement.API_HOST || 'localhost';
    var API_PORT = environnement.API_PORT || 8080;
    var API_SUBDOMAIN = environnement.API_SUBDOMAIN || '';

    var BASE_URL = environnement.BASE_URL ? environnement.BASE_URL : '';

    // Check if focus libraries should be held locally or read from NPM
    var localFocus = environnement.LOCAL_FOCUS ? JSON.parse(environnement.LOCAL_FOCUS) : false;

    if (localFocus) {
        config.addAlias('focus-core', _path2.default.resolve(process.cwd(), '../focus-core'));
        config.addAlias('focus-components', _path2.default.resolve(process.cwd(), '../focus-components'));
    }

    config.addDefinedVariable('__API_ROOT__', JSON.stringify(environnement.API_ROOT ? environnement.API_ROOT : API_PROTOCOL + '://' + API_HOST + ':' + API_PORT + '/' + API_SUBDOMAIN));
    config.addDefinedVariable('__BASE_URL__', JSON.stringify(BASE_URL));

    return config;
};

exports.default = defaultConfig;
module.exports = exports['default'];