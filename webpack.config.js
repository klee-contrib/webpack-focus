'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _default = require('./config/default');

var _default2 = _interopRequireDefault(_default);

var _envParser = require('./webpack-utilities/env-parser');

var _envParser2 = _interopRequireDefault(_envParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parsedConf = (0, _envParser2.default)(process.env);
exports.default = (0, _default2.default)(process.env, {}).toWebpackConfig(parsedConf);
module.exports = exports['default'];