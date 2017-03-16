'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var defaultEnv = {
    DEV: 'true', // Toggles the hot reloading
    DEV_SERVER_HOST: 'localhost', // Dev server hostname
    DEV_SERVER_PORT: 3000, // Dev server port
    ENTRY_FILE_PATH: './src', // Entry file to build the application
    npm_package_name: 'your-project', // Project name, automatically set by npm
    OUTPUT_DIR: './dist', // Output directory
    PAGE_TITLE: 'You project landing page', // Generated HTML page title
    ANCHOR_CLASS: 'your-project', // Generated HTML div's class
    GENERATE_HTML: 'false', // Toggle index.html auto generation
    MINIMIFY: 'false', // Toggles sources minification
    SOURCE_MAPS: 'true', // Toggles source maps generation
    PACKAGE_JSON_PATH: './', // package.json path inside of focus packages, as seen from their root file
    OUTPUT_PUBLIC_PATH: undefined, // Output directory, as seen from the index.html
    HOT_RELOAD: 'false', // Flag to disable hot reload, even in DEV
    DROP_CONSOLE: 'false', // If console statement should be dropped when MINIMIFY
    LEGACY_SEARCH_API: 'false', // If the legacy search API should be used
    NODE_ENV: 'dev' // If the environnement is developpement, or production 
};

var defaultHtmlTemplate = function defaultHtmlTemplate(env) {
    return '<html>\n    <head>\n        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>\n        <meta charset="UTF-8">\n        <title>' + env.PAGE_TITLE + '</title>\n    </head>\n    <body>\n        <div class="' + env.ANCHOR_CLASS + '"/>\n    </body>\n</html>';
};

var envParser = function envParser(env) {
    var newEnv = (0, _lodash.defaultsDeep)({}, env, defaultEnv);
    newEnv.DEV = JSON.parse(newEnv.DEV);
    newEnv.HOT_RELOAD = JSON.parse(newEnv.HOT_RELOAD);
    newEnv.GENERATE_HTML = JSON.parse(newEnv.GENERATE_HTML);
    newEnv.MINIMIFY = JSON.parse(newEnv.MINIMIFY);
    newEnv.DROP_CONSOLE = JSON.parse(newEnv.DROP_CONSOLE);
    newEnv.SOURCE_MAPS = JSON.parse(newEnv.SOURCE_MAPS);
    newEnv.LEGACY_SEARCH_API = JSON.parse(newEnv.LEGACY_SEARCH_API);

    newEnv.OUTPUT_PUBLIC_PATH = newEnv.OUTPUT_PUBLIC_PATH !== undefined ? newEnv.OUTPUT_PUBLIC_PATH : 'http://' + newEnv.DEV_SERVER_HOST + ':' + newEnv.DEV_SERVER_PORT + '/';

    newEnv.HTML_TEMPLATE = defaultHtmlTemplate;
    return newEnv;
};

exports.default = envParser;
module.exports = exports['default'];