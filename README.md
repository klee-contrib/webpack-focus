# webpack-focus

Focus standard loader for focus projects, as well with config and build files.
The objective is to have dependencies set in one project for all projects and all libraries.

The module will tell you what lib you need to install as `devDependencies` with an error message if the needed libraries are not present in your `package.json`.

# How to use focus web pack

You have 3 functions:
- `devConfig`, `productionConfig`, `server`
- Define a config on your project
```javascript
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
  ```
- Define your dev dev conf
```javascript
    const focusShowcaseConf = require('./focus-showcase.webpack');
    const devConfBuilder = require('webpack-focus').devConfig;
    module.exports = devConfBuilder(focusShowcaseConf);
```
- Define your web pack server
```javascript
    const path = require('path');
    const serverBuilder = require('webpack-focus').server;
    const focusShowcaseConf = require('./focus-showcase.webpack');
    serverBuilder(focusShowcaseConf);
```
