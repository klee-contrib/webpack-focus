import webpack from 'webpack';
import path from 'path';
import glob from 'glob';
import { cpus } from 'os';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import ConfigBuilder from '../webpack-utilities/config-builder';
import envParser from '../webpack-utilities/env-parser';


const baseConfig = (environnement, definedVariables) => {

    const parsedEnv = envParser(environnement);

    // Création de la config basique
    const config = new ConfigBuilder();

    config._debugInfo('logEnv', environnement);
    config._debugInfo('logParsedEnv', parsedEnv);

    // Ajout du point d'entrée pour le polyfill
    if (parsedEnv.USE_POLYFILL) {
        config.addEntry('babel-polyfill');
    }

    // Ajout des points d'entrée pour le hot reload
    if (parsedEnv.HOT_RELOAD) {

        // config.addEntry('webpack-dev-server/client');
        config.addEntry('react-dev-utils/webpackHotDevClient');
        // Errors should be considered fatal in development
        config.addEntry('react-error-overlay');
        config.addEntry('webpack/hot/only-dev-server');
        config.addEntry('react-hot-loader/patch');
    }

    // Ajout des points d'entrée pour le hot reload
    config.addEntry(parsedEnv.ENTRY_FILE_PATH);

    // Ajout du fichier
    config.setOuputPath(parsedEnv.OUTPUT_DIR, true);
    config.setAssetsPublicPath(parsedEnv.OUTPUT_PUBLIC_PATH);
    config.setFilename(parsedEnv.USE_VERSION ? parsedEnv.npm_package_name + '.' + parsedEnv.npm_package_version : parsedEnv.npm_package_name);
    config.useSourceMaps(parsedEnv.SOURCE_MAPS);
    config.setChunkFileName(parsedEnv.CHUNK_FILE_NAME);

    // Ajout des variables injectées
    config.addDefinedVariable('__DEV__', parsedEnv.DEV ? 'true' : 'false');
    config.addDefinedVariable('__HOT_RELOAD__', parsedEnv.HOT_RELOAD ? 'true' : 'false')
    config.addDefinedVariable('__ANCHOR_CLASS__', JSON.stringify(parsedEnv.ANCHOR_CLASS));
    config.addDefinedVariable('__PACKAGE_JSON_PATH__', JSON.stringify(parsedEnv.PACKAGE_JSON_PATH));
    // config.addDefinedVariable('__USER__', JSON.stringify(USER));
    config.addDefinedVariable('__PROJECT__', JSON.stringify(parsedEnv.npm_package_name));
    config.addDefinedVariable('LEGACY_SEARCH_API', JSON.stringify(parsedEnv.LEGACY_SEARCH_API));
    config.addDefinedVariable('process.env.NODE_ENV', JSON.stringify(parsedEnv.NODE_ENV));

    for (let prop in definedVariables) {
        config.addDefinedVariable(prop, definedVariables[prop]);
    }

    // GESTION DES ALIAS
    config.addAlias('react', './node_modules/react');
    config.addAlias('react-dom', './node_modules/react-dom');
    config.addAlias('moment', './node_modules/moment');
    config.addAlias('numeral', './node_modules/numeral');
    config.addAlias('material-design-lite', './node_modules/material-design-lite');

    // GESTION DES PLUGINS
    // Les fonctions seront résolues au moment de la création de la config webpack.
    config.addPlugin(10, () => new webpack.DefinePlugin(config.getDefinedVariables()));
    if (!parsedEnv.HOT_RELOAD) {
        config.addPlugin(20, () => new ExtractTextPlugin(config.getCssFilename()));
    }
    // Gestion du HOT_RELOAD
    if (parsedEnv.HOT_RELOAD) {
        config.addPlugin(30, new webpack.HotModuleReplacementPlugin());
        config.addPlugin(35, new webpack.NamedModulesPlugin());
    }
    // Génération d'un index HTML
    if (parsedEnv.GENERATE_HTML) {
        config.addPlugin(40, env => new HtmlWebpackPlugin({
            inject: 'body',
            templateContent: env.HTML_TEMPLATE(env)
        }));
    }


    // Gestion de la minification
    if (parsedEnv.MINIMIFY) {
        config.addPlugin(50, env => new UglifyJsPlugin({
            sourceMap: env.SOURCE_MAPS,
            parallel: true,
            uglifyOptions: {
                warnings: false,
                compress: {
                    drop_console: env.DROP_CONSOLE,
                    drop_debugger: true,
                    passes: 2,
                    keep_infinity: true,
                    ecma: env.ECMA_MODE
                },
                output: {
                    ecma: env.ECMA_MODE
                }
            }
        }));
    }

    config.addPlugin(60, new CaseSensitivePathsPlugin());
    config.addPlugin(70, new WatchMissingNodeModulesPlugin(path.join(process.cwd(), 'node_modules')));
    config.addPlugin(80, new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));


    // Not working well
    // if (!parsedEnv.DEV) {
    //     config.addPlugin(90, new webpack.IgnorePlugin(/focus-devtools/));
    // }

    if (parsedEnv.ANALYZE) {
        config.addPlugin(100, new BundleAnalyzerPlugin());
    }
    // GESTION DES LOADERS
    // Loader pour les source-map
    if (parsedEnv.SOURCE_MAPS) {
        config.addComplexLoader(10, {
            test: /\.(js|jsx)$/,
            enforce: 'pre',
            exclude: /node_modules\\css-loader/,
            loader: 'source-map-loader'
        });
    }
    // // Loader pour eslint
    // config.addComplexLoader(15, {
    //     test: /\.(js|jsx)/,
    //     enforce: 'pre',
    //     exclude: /node_modules/,
    //     loader: 'eslint-loader',
    //     options: {
    //         cache: true,
    //         emitError: false,
    //         emitWarning: false,
    //         failOnError: false,
    //         failOnWarning: false
    //     }
    // });

    // Default loader pour les fichiers inconnu
    config.addComplexLoader(15, env => ({
        exclude: [
            /\.(js|jsx)$/,
            /\.(ts|tsx)$/,
            /\.css$/,
            /\.scss$/,
            /\.json$/,
            /\.(ttf|eot|woff|woff2|svg)(\?.*)?$/,
            /\.(png|jpg|jpeg|gif)(\?.*)?$/
        ],
        loader: 'file-loader',
        options: {
            limit: env.ASSET_LIMIT,
            name: 'misc/[name]_[sha512:hash:base64:7].[ext]'
        }
    }))

    // Loader pour Babel (transpile ES6 => ES5, exclude des node_modules, attendus en ES5)
    config.addComplexLoader(20, {
        test: /\.(js|jsx)$/,
        use: [
           /* 'cache-loader',
            {
                loader: 'thread-loader',
                options: {
                    // Let's leave 2 cpus free, for plugins, OS, ...
                    workers: Math.max(cpus().length - 2, 1)
                }
            },*/ {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: ['babel-preset-focus']
                }
            }
        ],
        exclude: { and: [/node_modules/, { not: [/focus-components/] }] } // FIXME for now, change /focus-*/ to /focus-components/
    });

    // Loader pour le SASS (Extraction du fichier JS, vers un fichier CSS indépendant, cf plugin)
    // Utilisation de PostCss ajouté
    let cssLoaders = [
        {
            loader: 'css-loader',
            options: {
                minimize: false,
                // sourceMap: env.SOURCE_MAPS,
                importLoaders: 2
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
        },
        {
            loader: 'sass-loader',
            options: {
                includePaths: glob.sync('node_modules').map((d) => path.join(process.cwd(), d))
                // sourceMap: env.SOURCE_MAPS
            }
        }
    ];

    if (!parsedEnv.HOT_RELOAD) {
        cssLoaders = ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: cssLoaders
        });
    } else {
        cssLoaders.unshift('style-loader');
    }

    config.addComplexLoader(30, {
        test: /\.(css|scss)$/,
        use: cssLoaders
    });

    // Loader pour les fonts
    config.addComplexLoader(50, env => ({
        test: /\.(ttf|eot|woff|woff2|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
            limit: env.ASSET_LIMIT,
            name: 'fonts/[name]_[sha512:hash:base64:7].[ext]'
        }
    }));

    // Loader pour les images
    config.addComplexLoader(55, env => ({
        test: /\.(png|jpg|jpeg|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
            limit: env.ASSET_LIMIT,
            name: 'img/[name]_[sha512:hash:base64:7].[ext]'
        }
    }));
    return config;
};

export default baseConfig;
