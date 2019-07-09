import path from "path";

export default ({ file, _options, env }) => {
    let browsers = process.env.BROWSERS || ">1%|last 4 versions|Firefox ESR|not ie < 9";

    let variables = {};
    if (process.env.CSS_VARIABLE_FILE) {
        variables = require(path.resolve("./" + process.env.CSS_VARIABLE_FILE));
    }
    return {
        plugins: {
            "postcss-import": {
                root: file.dirname
            },
            "postcss-mixins": true,
            "postcss-flexbugs-fixes": true,
            "postcss-normalize": true,
            "postcss-custom-properties": {
                preserve: false,
                variables
            },
            "postcss-color-function": true,
            "postcss-preset-env": {
                stage: 3,
                overrideBrowserslist: browsers.split("|"),
                features: {
                    "nesting-rules": true
                }
            },
            cssnano: env === "production" ? { preset: "default" } : false
        }
    };
};
