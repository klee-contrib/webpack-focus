const t = require('../lib');
const path = require('path');
const conf = {
    entry: ['./app'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'focus-showcase.js',
        publicPath: '/dist/'
    },
    port: 3007
}

t.devConfig(conf);
