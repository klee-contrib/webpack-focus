import { serverLauncher } from './dev-server';
import baseConfig from './config/base';

const configBuilder = (customConf = {}, definedVariables = {}) => {
    return baseConfig(process.env, definedVariables).toWebpackConfig(customConf);
}

export {
    serverLauncher,
    configBuilder
}