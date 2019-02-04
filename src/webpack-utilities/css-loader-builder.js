import path from "path";
import glob from "glob";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

/**
 * Build a CSS config.
 * @param {object} parsedEnv Env config.
 * @param {object} cssOptions Options.
 * @param {bool} handleScss If should handle scss.
 * @param {bool} handleCss If should handle css.
 * @returns {object} Loaders.
 */
export default function cssLoaderBuilder(parsedEnv, cssOptions = {}, handleScss = true, handleCss = true) {
    let cssLoaders = [
        {
            loader: !parsedEnv.HOT_RELOAD ? MiniCssExtractPlugin.loader : "style-loader"
        },
        {
            loader: "css-loader",
            options: {
                importLoaders: handleScss ? 2 : 1,
                ...cssOptions
            }
        },
        {
            loader: "postcss-loader",
            options: {
                // Other options should go into postcss.config.js
                config: {
                    path: path.join(process.cwd(), "postcss.config.js")
                }
                // sourceMap: env.SOURCE_MAPS
            }
        }
    ];

    if (handleScss) {
        cssLoaders.push({
            loader: "sass-loader",
            options: {
                includePaths: glob.sync("node_modules").map(d => path.join(process.cwd(), d))
                // sourceMap: env.SOURCE_MAPS
            }
        });
    }

    return {
        test: handleScss && handleCss ? /\.(css|scss)$/ : handleCss ? /\.css$/ : handleScss ? /\.scss$/ : false,
        use: cssLoaders
    };
}
