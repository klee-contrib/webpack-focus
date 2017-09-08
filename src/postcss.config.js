import path from 'path';


export default ({ file, options, env }) => {
    let browsers = process.env.BROWSERS || '>1%|last 4 versions|Firefox ESR|not ie < 9';

    let variables = {};
    if (process.env.CSS_VARIABLE_FILE) {
        variables = require(path.resolve('./' + process.env.CSS_VARIABLE_FILE));
    }
    return {
        plugins: {
            'postcss-flexbugs-fixes': true,
            'postcss-import': { root: file.dirname },
            'postcss-cssnext': {
                browsers: browsers.split('|'),
                features: {
                    customProperties: {
                        variables
                    }
                }
            },
            cssnano: env === 'production' ? { preset: 'default' } : false
        }
    }
};
