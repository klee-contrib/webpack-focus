import { serverLauncher } from "./dev-server";
import baseConfig from "./config/base";
import envParser from "./webpack-utilities/env-parser";

/**
 * Function to build a webpack conf, from a custom conf to be merged, and defined variables
 *
 * @param {any} [customConf={}] a custom partial webpack conf, to be merged
 * @param {any} [definedVariables={}] some variables to be defined
 * @returns {object} the webpack conf built
 */
const configBuilder = (customConf = {}, definedVariables = {}) => {
    return baseConfig(process.env, definedVariables).toWebpackConfig(envParser(process.env), customConf);
};

export { serverLauncher, configBuilder };
