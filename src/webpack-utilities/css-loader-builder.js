import path from 'path';
import glob from 'glob';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default function cssLoaderBuilder(parsedEnv, cssOptions = {}, handleScss = true, handleCss = true) {

    let cssLoaders = [
        {
            loader: 'css-loader',
            options: {
                minimize: false,
                // sourceMap: env.SOURCE_MAPS,
                importLoaders: handleScss ? 2 : 1,
                ...cssOptions
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                // Other options should go into postcss.config.js
                config: {
                    path: path.join(process.cwd(), 'postcss.config.js')
                }
                // sourceMap: env.SOURCE_MAPS
            }
        }
    ];

    if (handleScss) {
        cssLoaders.push({
            loader: 'sass-loader',
            options: {
                includePaths: glob.sync('node_modules').map((d) => path.join(process.cwd(), d))
                // sourceMap: env.SOURCE_MAPS
            }
        });
    }

    if (!parsedEnv.HOT_RELOAD) {
        cssLoaders = ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: cssLoaders
        });
    } else {
        cssLoaders.unshift('style-loader');
    }

    return {
        test: handleScss && handleCss ? /\.(css|scss)$/ : handleCss ? /\.css$/ : handleScss ? /\.scss$/ : false,
        use: cssLoaders
    };

}