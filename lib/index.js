'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.configBuilder = exports.serverLauncher = undefined;

var _devServer = require('./dev-server');

var _base = require('./config/base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var configBuilder = function configBuilder() {
    var customConf = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var definedVariables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return (0, _base2.default)(process.env, definedVariables).toWebpackConfig(customConf);
};

exports.serverLauncher = _devServer.serverLauncher;
exports.configBuilder = configBuilder;