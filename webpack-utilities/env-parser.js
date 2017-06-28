'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defaultEnv = {
    DEV: 'true', // Toggles the hot reloading
    DEV_SERVER_PROTOCOL: 'http', // Dev server protocol
    DEV_SERVER_HOST: 'localhost', // Dev server hostname
    DEV_SERVER_PORT: 3000, // Dev server port
    ENTRY_FILE_PATH: './src', // Entry file to build the application
    npm_package_name: 'your-project', // Project name, automatically set by npm
    npm_package_version: '0.0.0', // Project version, automatically set by npm
    OUTPUT_DIR: './dist', // Output directory
    PAGE_TITLE: 'You project landing page', // Generated HTML page title
    ANCHOR_CLASS: 'your-project', // Generated HTML div's class
    GENERATE_HTML: 'false', // Toggle index.html auto generation
    MINIMIFY: 'false', // Toggles sources minification
    USE_VERSION: 'false', // Toggle the use of the version in the name of the files
    SOURCE_MAPS: 'true', // Toggles source maps generation
    PACKAGE_JSON_PATH: './', // package.json path inside of focus packages, as seen from their root file
    OUTPUT_PUBLIC_PATH: undefined, // Output directory, as seen from the index.html
    HOT_RELOAD: 'false', // Flag to disable hot reload, even in DEV
    DROP_CONSOLE: 'false', // If console statement should be dropped when MINIMIFY
    LEGACY_SEARCH_API: 'false', // If the legacy search API should be used
    NODE_ENV: 'development', // If the environnement is developpement, or production
    USE_POLYFILL: 'true', // If Babel polyfill should be used as an entry
    ANALYZE: 'false', // Use webpack bundle analyzer
    ASSET_LIMIT: '10000', // Size threshold in bytes to include in base64 in css,
    LEGACY_OUTPUT: 'false' // Output content to ES5
};

var defaultHtmlTemplate = function defaultHtmlTemplate(env) {
    return '<html>\n    <head>\n        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>\n        <meta charset="UTF-8">\n        <title>' + env.PAGE_TITLE + '</title>\n    </head>\n    <body>\n        <div class="' + env.ANCHOR_CLASS + '"/>\n    </body>\n</html>';
};

var envParser = function envParser(env) {
    var newEnv = _extends({}, defaultEnv, env);
    newEnv.DEV = JSON.parse(newEnv.DEV);
    newEnv.HOT_RELOAD = JSON.parse(newEnv.HOT_RELOAD);
    newEnv.GENERATE_HTML = JSON.parse(newEnv.GENERATE_HTML);
    newEnv.MINIMIFY = JSON.parse(newEnv.MINIMIFY);
    newEnv.USE_VERSION = JSON.parse(newEnv.USE_VERSION);
    newEnv.DROP_CONSOLE = JSON.parse(newEnv.DROP_CONSOLE);
    newEnv.SOURCE_MAPS = JSON.parse(newEnv.SOURCE_MAPS);
    newEnv.LEGACY_SEARCH_API = JSON.parse(newEnv.LEGACY_SEARCH_API);
    newEnv.USE_POLYFILL = JSON.parse(newEnv.USE_POLYFILL);
    newEnv.ANALYZE = JSON.parse(newEnv.ANALYZE);
    newEnv.ASSET_LIMIT = JSON.parse(newEnv.ASSET_LIMIT);
    newEnv.LEGACY_OUTPUT = JSON.parse(newEnv.LEGACY_OUTPUT);

    newEnv.OUTPUT_PUBLIC_PATH = newEnv.OUTPUT_PUBLIC_PATH !== undefined ? newEnv.OUTPUT_PUBLIC_PATH : newEnv.DEV_SERVER_PROTOCOL + '://' + newEnv.DEV_SERVER_HOST + ':' + newEnv.DEV_SERVER_PORT + '/';

    newEnv.HTML_TEMPLATE = defaultHtmlTemplate;
    return newEnv;
};

exports.default = envParser;
module.exports = exports['default'];