'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.configBuilder = exports.serverLauncher = undefined;

var _webpackConfigBuilder = require('./webpack-config-builder');

var _devServer = require('./dev-server');

exports.serverLauncher = _devServer.serverLauncher;
exports.configBuilder = _webpackConfigBuilder.configBuilder;