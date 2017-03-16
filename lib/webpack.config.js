'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _default = require('./config/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _default2.default)(process.env, {});
module.exports = exports['default'];