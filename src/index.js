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
    import devConfig from 'webpack-focus/dev-config';
    import productionConfig from 'webpack-focus/production-config';
    import server from 'webpack-focus/server';
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
