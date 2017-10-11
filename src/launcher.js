#!/usr/bin/env node

import { serverLauncher } from './index';
// We take the config relative to the process folder, assuming user launch command from project folder
const webpackConfig = require(process.cwd() + '/webpack.config');
serverLauncher(webpackConfig, {});
