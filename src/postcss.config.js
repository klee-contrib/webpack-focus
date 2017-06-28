export default ({ file, options, env }) => {
    const variables = require('./' + options.variableFile);
    return {
        plugins: {
            'postcss-flexbugs-fixes': true,
            'postcss-import': { root: file.dirname },
            'postcss-cssnext': {
                features: {
                    customProperties: {
                        variables
                    }
                }
            },
            autoprefixer: {
                browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9' // React doesn't support IE8 anyway
                ],
                flexbox: 'no-2009'
            },
            cssnano: env === 'production' ? { preset: 'default' } : false
        }
    }
};
