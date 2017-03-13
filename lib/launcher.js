#!/usr/bin/env node
'use strict';

var _index = require('./index');

var _webpack = require('./webpack.config');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _index.serverLauncher)(_webpack2.default, {});