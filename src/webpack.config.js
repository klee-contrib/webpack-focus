import defaultConfig from './config/default';
import envParser from './webpack-utilities/env-parser';

const parsedConf = envParser(process.env);
export default defaultConfig(process.env, {}).toWebpackConfig(parsedConf);