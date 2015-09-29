import isInstalled from './is-installed';
import conf from '../package.json';
let missingInstall = [];
for (const dep in conf.devDependencies){
    if(!isInstalled(dep)){
        missingInstall.push(dep);
    }
}
if(missingInstall.length >0){
    const ERROR = `
        Your package.json is missing the following dependencies ${missingInstall.concat(',')}
        , please refer to node_modules/webpack-focus/package.json to see the needed packages and their versions.
        You should save them as devDependencies uning the command
        npm install --save-dev ${missingInstall.concat('')}
    `;
    throw new Error(ERROR);
}
const MSG = `
    Your dependencies are fine, please read the documentation to use if on your project
    - Initialisation of focus web pack
    - you can use 3 functions
    //- devConfig, productionConfig, server
    ## Your conf
    /*
    const path = require('path');
    module.exports = {
        entry: ['./app'],
        directory:"src",
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'focus-showcase.js',
            publicPath: '/dist/'
        },
        port: 3007
    };
    */
    ## Web pack dev conf
    /*javascript
    const focusShowcaseConf = require('./focus-showcase.webpack');
    const devConfBuilder = require('webpack-focus').devConfig;
    module.exports = devConfBuilder(focusShowcaseConf);
    */
    ## Web pack server
    /*javascript
    const path = require('path');
    const serverBuilder = require('webpack-focus').server;
    const focusShowcaseConf = require('./focus-showcase.webpack');
    serverBuilder(focusShowcaseConf);
    */
`;
console.log(MSG);

import devConfig from './dev-config';
import productionConfig from './production-config';
import server from './server';
export default {
    devConfig,
    productionConfig,
    server
}
