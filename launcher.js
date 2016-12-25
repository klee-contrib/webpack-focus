#!/usr/bin/env node

import { serverLauncher } from './index';
import config from './webpack.config';

serverLauncher(config, { proxy: null });
