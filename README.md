# Focus Webpack preset

Standard Webpack preset for Focus compliant projects. It relies on environment variables, set in `process.env`.

To configure this, a good option is to use [better-npm-run]( https://www.npmjs.com/package/better-npm-run). It will run npm script with environment variables.

## Environment variables

### Dev server variables

- `DEV_SERVER_PROTOCOL` (default `'http'`) : webpack dev server protocol
- `DEV_SERVER_HOST` (default `'localhost'`): webpack dev server hostname
- `DEV_SERVER_PORT` (default `3000`): webpack dev server port
- `PUBLIC_PATH` (default `'/'`): path to the built files on the webpack dev server
- `PAGE_TITLE` (default `'You project landing page'`): webpack dev server page title
- `GENERATE_HTML` (default `false`): automatically generate the `index.html`

### Output variables

- `OUTPUT_DIR` (default `'./dir'`): output directory
- `OUTPUT_PUBLIC_PATH` : Path from the CSS file to the ressources folder, for resolving fonts, images, ... (should be `'/'`, or `/assets/` ...)
- `USE_VERSION` (default= `false`): If the version should be used in file name generated, for js et css (`[project_name].[project_version].js`,`[project_name].project_version].css`)

### Output options

- `DEV` (default `true`): Flag to mark the development state. Exposed globally through the variable `__DEV__` (needed for devtools)
- `HOT_RELOAD` (default `false`): Flag to disable hot reload, even in DEV
- `MINIMIFY` (default `false`): minimify the sources
- `NODE_ENV` (default `developement`): If the environnement is developpement, or production (use `production` for recette or production). Should always be set
- `SOURCE_MAPS` (default= `true`): Toggles source maps generation
- `LEGACY_EXPORTS` (default= `'false'`): Output exports to legacy module.exports and not to ES6 export
- `LEGACY_LODASH` (default= `'false'`): Disable lodash transformation to more precise import (for example `import {toPairs} from 'lodash'`, transformed to `import toPairs from 'lodash/toPairs'`)
- `USE_POLYFILL` (default= `true`): If babel polyfill should be added to entries.
- `DROP_CONSOLE` (default= `false`): If console statement should be dropped when MINIMIFY
- `CHUNK_FILE_NAME` (default= `'chunks/[name]_[hash].[ext]'`): Chunk file naming
- `ECMA_MODE` (default= `'5'`): Output mode for Uglify

### Miscellaneous

- `ENTRY_FILE_PATH` (default `'./src'`): project entry file path, that is to say the file launching the app
- `ANCHOR_CLASS` (default `'your-project'`): class used to anchor the `ReactDOM.render`. Exposed globally through the variable `__ANCHOR_CLASS__`
- `BROWERS` (default: `'>1%|last 4 versions|Firefox ESR|not ie < 9'`): Browser query for Babel preset and PostCss
- `ASSET_LIMIT` (default: `'10000'`): Size threshold in bytes to include in base64 in css
- `ANALYZE` (default `'./Webpack'`): Use webpack bundle analyzer to see details about bundle
- `IS_VERTIGO` (default `'false'`): Env variable, used in focus-components > 2.2.2, to defined if default values should be partial or not. If you use Vertigo, put this to true, if you have problem when upgrading (save actions not working, because of null values)
- `USE_CACHE` (default `'true'`): If a local cache should be used for faster rebuild (cache folder is .cache-loader)
- `PARALLEL_BUILD` (default `'false'`): If initial build should be done in parallel, for faster build

### LEGACY (API_ROOT and BASE_URL are better defined as externals inside `<script>` in your html)

- `API_PROTOCOL` (default `'http'`): Protocol for API
- `API_HOST` (default `'localhost'`): Default host for API
- `API_PORT` (default `'8080'`): Default port for API
- `API_SUBDOMAIN` (default `''`): Default subdomain for API
- `API_ROOT` (default `${API_PROTOCOL}://${API_HOST}:${API_PORT}/${API_SUBDOMAIN}`): Root URL for API
- `BASE_URL` (default `''`): Default root url for navigate and link
- `LOCAL_FOCUS` (default `'false'`): Env variable to use a local focus. Better user webpack alias directly
- `LEGACY_SEARCH_API` (default `'false'`): If the legacy search API should be used

## Webpack configuration builder

Create a file `postcss.config.js`

PostCSS is a great tool to transform CSS, with many plugins, such as Autoprefixer, ...
There is a distinct configuration file for PostCSS, the default config contains Autoprefixer.

See [PostCSS Loader](https://github.com/postcss/postcss-loader) and [PostCSS](http://postcss.org/)

```js
const defaultConfig = require('webpack-focus/postcss.config.js');
// Load the default config.

module.exports = defaultConfig;
```

Create a file `webpack.config.js` with a content, such as this :

```js
const baseConfig = require('webpack-focus/config/base');
const envParser = require('webpack-focus/webpack-utilities/env-parser');

const myConfig = baseConfig(process.env, {});

// Do your own modification

// Add externals, alias, defined variable, plugin, loader, change filename, change HTML template,  ...
// See https://github.com/KleeGroup/webpack-focus/blob/webpack2/src/webpack-utilities/config-builder.js
// Or see base config https://github.com/KleeGroup/webpack-focus/blob/webpack2/src/config/base.js

/*
myConfig.addExternal('__API_ROOT__', '__API_ROOT__');
// Add alias with relative path
myConfig.addAlias('focus-core', '../focus-core');
// Or not
myConfig.addAlias('truc', 'C:/bla/truc', false);

myConfig.addDefinedVariable('__DEV__', parsedEnv.DEV ? 'true' : 'false');

// Add plugin or loader directly, or using a function, so the resolution is done when calling toWebpackConfig
// For example, the DefinePlugin is given as a function, so variable can be added easily
myConfig.addPlugin(10, () => new webpack.DefinePlugin(myConfig.getDefinedVariables()));

myConfig.addComplexLoader(20, {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
            presets: ['babel-preset-focus']
        }
});
*/

module.exports = myConfig.toWebpackConfig(envParser(process.env));
```

In your package.json, add scripts and better scripts.
See the following example :

- the `start` script is made to use hot reload, source maps and dev-server
- the `watch` script is made to use a watcher, with a developpement config, but without source-maps or hot-reload
- the `bundle` script is made to build production-ready js and css, without console log, with minified files, to deliver in test environnement

Both the `watch` and `bundle` postfix the generated file name with the version in package.json, to avoid cache issues (`USE_VERSiON` parameter)
The other generated file name contain a hash, for the same purpose.

```js
    "scripts": {
        "bundle": "better-npm-run bundle",
        "watch": "better-npm-run watch",
        "start": "better-npm-run start",
    },
    "betterScripts": {
        "bundle": {
            "command": "webpack --color --progress",
            "env": {
                "ANCHOR_CLASS": "application",
                "ENTRY_FILE_PATH": "./app/index",
                "OUTPUT_DIR": "../../my/app/folder",
                "OUTPUT_PUBLIC_PATH": "./",
                "GENERATE_HTML": "false",
                "USE_VERSION": "true",
                "DEV": "false",
                "NODE_ENV": "production",
                "SOURCE_MAPS": "false",
                "MINIMIFY": "true",
                "DROP_CONSOLE": "true"
            }
        },
        "watch": {
            "command": "webpack --color --watch --progress",
            "env": {
                "ANCHOR_CLASS": "application",
                "ENTRY_FILE_PATH": "./app/index",
                "OUTPUT_DIR": "../../my/app/folder",
                "OUTPUT_PUBLIC_PATH": "./",
                "USE_VERSION": "true",
                "DEV": "true",
                "NODE_ENV": "developement",
                "HOT_RELOAD": "false",
                "SOURCE_MAPS": "false"
            }
        },
        "start": {
            "command": "focus-dev-server",
            "env": {
                "ENTRY_FILE_PATH": "./app",
                "DEV_SERVER_SUBDOMAIN":"AtlasFrontEnd/",
                "NODE_ENV": "developement",
                "HOT_RELOAD": "true",
                "GENERATE_HTML": "true"
            }
        },
    },

```


### Which config should I use ?

If you are not using defined variables such as `BASE_URL`,  `API_ROOT`, `LOCAL_FOCUS` (that is to say, if you are using `backbone`), use the base config `const baseConfig = require('webpack-focus/config/base');`.
Else, use the default config `const defaultConfig = require('webpack-focus/config/default');`.

### I want to use the base config, but I want to add a custom loader (such as TypeScript, or anything else). How should I do ?

Easy, the loaders and plugins are ordered, and the webpack config is defined only when calling toWebpackConfig().
Just use any order you want to add a loader or a plugin between two existing loaders or plugins.

#### Plugins 

- 10 - DefinePlugin
- 20 - ExtractTextPlugin
- 30 - HotModuleReplacementPlugin
- 40 - HtmlWebpackPlugin
- 50 - UglifyJsPlugin

#### Loaders 

- 10 - source map loader (using `enforce:pre`, so it is a pre loader)
- 20 - babel loader
- 30 - SASS -> ExtractTextPlugin, with css-loader, postcss-loader, sass-loader
- 40 - CSS -> ExtractTextPlugin, with css-loader, postcss-loader
- 50 - url-loader (for ressources files)
