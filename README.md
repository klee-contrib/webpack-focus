# Focus Webpack preset

Standard Webpack preset for Focus compliant projects. It exposes two functions :
- `configBuilder`: builds a webpack configuration, by merging a default one and an optionnal custom one
- `serverLauncher`: starts a Webpack dev server, with a webpack config and an optionnal custom server config

These functions rely on environment variables, set in `process.env`.

To configure this, a good option is to use [better-npm-run]( https://www.npmjs.com/package/better-npm-run). It will run npm script with environment variables.

## Environment variables

- `DEV` (default `true`): flag to mark the development state. Exposed globally through the variable `__DEV__`
- `DEV_SERVER_HOST` (default `'localhost'`): webpack dev server hostname
- `DEV_SERVER_PORT` (default `3000`): webpack dev server port
- `API_HOST` (default `'localhost'`): API hostname
- `API_PORT` (default `8080`): API port
- `ENTRY_FILE_PATH` (default `'./src'`): project entry file path
- `OUTPUT_FILE_NAME` (default `'your-project-name'`): project file name
- `OUTPUT_DIR` (default `'./dir'`): output directory
- `PAGE_TITLE` (default `'You project landing page'`): webpack dev server page title
- `ANCHOR_CLASS` (default `'your-project'`): class used to anchor the `ReactDOM.render`. Exposed globally through the variable `__ANCHOR_CLASS__`
- `PUBLIC_PATH` (default `'/'`): path to the built files on the webpack dev server
- `GENERATE_HTML` (default `true`): automatically generate the `index.html`
- `BABELIFIED_PATH` (default `'./src'`): directory build by Babel, you can also give multiple source folders giving an array (ex: ['./foo', './src/lala']
- `MINIMIFY` (default `false`): minimify the sources
- `BROWSERS` (default `null`): browsers list that should be taken into account by the autoprefixer-loader
- `SOURCE_MAPS` (default= `true`)Toggles source maps generation


## Webpack configuration builder

>`configBuilder(optionalConfiguration) -> builtConfiguration`

### Sample usage

```js
const configBuilder = require('webpack-focus').configBuilder;
module.exports = configBuilder();
```

## Webpack dev server launcher

>`serverLauncher(webpakConfiguration, optionalConfiguration)`

### Sample usage

```js
const serverLauncher = require('webpack-focus').serverLauncher;
serverLauncher(webpackConfig);
```
