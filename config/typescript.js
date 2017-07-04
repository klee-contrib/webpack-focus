'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _getLocalIdent2 = require('css-loader/lib/getLocalIdent');

var _getLocalIdent3 = _interopRequireDefault(_getLocalIdent2);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _webpackBundleAnalyzer = require('webpack-bundle-analyzer');

var _configBuilder = require('../webpack-utilities/config-builder');

var _configBuilder2 = _interopRequireDefault(_configBuilder);

var _envParser = require('../webpack-utilities/env-parser');

var _envParser2 = _interopRequireDefault(_envParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
// import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
// import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
var baseConfig = function baseConfig(environnement, definedVariables) {

    var parsedEnv = (0, _envParser2.default)(environnement);

    // Création de la config basique
    var config = new _configBuilder2.default();

    config._debugInfo('logEnv', environnement);
    config._debugInfo('logParsedEnv', parsedEnv);

    // // Ajout du point d'entrée pour le polyfill
    // if (parsedEnv.USE_POLYFILL) {
    //     config.addEntry('babel-polyfill');
    // }

    // // Ajout des points d'entrée pour le hot reload
    // if (parsedEnv.DEV && parsedEnv.HOT_RELOAD) {

    //     // config.addEntry('webpack-dev-server/client');
    //     config.addEntry('react-dev-utils/webpackHotDevClient');
    //     // Errors should be considered fatal in development
    //     config.addEntry('react-error-overlay');
    //     config.addEntry('webpack/hot/only-dev-server');
    //     config.addEntry('react-hot-loader/patch');
    // }

    // Ajout des points d'entrée pour le hot reload
    config.addEntry(parsedEnv.ENTRY_FILE_PATH);

    // Ajout du fichier
    config.setOuputPath(parsedEnv.OUTPUT_DIR, true);
    config.setAssetsPublicPath(parsedEnv.OUTPUT_PUBLIC_PATH);
    config.setFilename(parsedEnv.USE_VERSION ? parsedEnv.npm_package_name + '.' + parsedEnv.npm_package_version : parsedEnv.npm_package_name);
    config.useSourceMaps(parsedEnv.SOURCE_MAPS);
    config.setChunkFileName(parsedEnv.CHUNK_FILE_NAME);

    // Ajout des variables injectées
    // config.addDefinedVariable('__DEV__', parsedEnv.DEV ? 'true' : 'false');
    // config.addDefinedVariable('__HOT_RELOAD__', parsedEnv.HOT_RELOAD ? 'true' : 'false')
    // config.addDefinedVariable('__ANCHOR_CLASS__', JSON.stringify(parsedEnv.ANCHOR_CLASS));
    // config.addDefinedVariable('__PACKAGE_JSON_PATH__', JSON.stringify(parsedEnv.PACKAGE_JSON_PATH));
    // // config.addDefinedVariable('__USER__', JSON.stringify(USER));
    // config.addDefinedVariable('__PROJECT__', JSON.stringify(parsedEnv.npm_package_name));
    // config.addDefinedVariable('LEGACY_SEARCH_API', JSON.stringify(parsedEnv.LEGACY_SEARCH_API));
    // config.addDefinedVariable('process.env.NODE_ENV', JSON.stringify(parsedEnv.NODE_ENV));

    for (var prop in definedVariables) {
        config.addDefinedVariable(prop, definedVariables[prop]);
    }

    // GESTION DES ALIAS
    // config.addAlias('react', './node_modules/react');
    // config.addAlias('react-dom', './node_modules/react-dom');
    // config.addAlias('moment', './node_modules/moment');
    // config.addAlias('numeral', './node_modules/numeral');
    // config.addAlias('material-design-lite', './node_modules/material-design-lite');

    // GESTION DES PLUGINS
    // Les fonctions seront résolues au moment de la création de la config webpack.
    // config.addPlugin(10, () => new webpack.DefinePlugin(config.getDefinedVariables()));
    config.addPlugin(20, function () {
        return new _extractTextWebpackPlugin2.default(config.getCssFilename());
    });
    // // Gestion du HOT_RELOAD
    // if (parsedEnv.HOT_RELOAD) {
    //     config.addPlugin(30, new webpack.HotModuleReplacementPlugin());
    //     config.addPlugin(35, new webpack.NamedModulesPlugin());
    // }
    // // Génération d'un index HTML
    if (parsedEnv.GENERATE_HTML) {
        config.addPlugin(40, function (env) {
            return new _htmlWebpackPlugin2.default({
                inject: 'body',
                templateContent: env.HTML_TEMPLATE(env)
            });
        });
    }

    // Gestion de la minification
    // if (parsedEnv.MINIMIFY) {
    //     config.addPlugin(50, env => new UglifyJsPlugin({
    //         sourceMap: env.SOURCE_MAPS,
    //         extractComments: {
    //             // banner: true
    //         },
    //         uglifyOptions: {
    //             ie8: false,
    //             warnings: false,
    //             compress: {
    //                 drop_console: env.DROP_CONSOLE,
    //                 drop_debugger: true,
    //                 passes: 2,
    //                 keep_infinity: true
    //                 // ecma: 6
    //             },
    //             output: {
    //                 // ecma: 6,
    //                 // preamble: '/** OHHHH YEEAAAAAH **/',
    //                 // comments: 'all'
    //             }
    //         }
    //     }));
    // }

    // config.addPlugin(60, new CaseSensitivePathsPlugin());
    // config.addPlugin(70, new WatchMissingNodeModulesPlugin(path.join(process.cwd(), 'node_modules')));
    config.addPlugin(80, new _webpack2.default.IgnorePlugin(/^\.\/locale$/, /moment$/));

    // if (!parsedEnv.DEV) {
    //     config.addPlugin(90, new webpack.IgnorePlugin(/focus-devtools/));
    // }

    if (parsedEnv.ANALYZE) {
        config.addPlugin(100, new _webpackBundleAnalyzer.BundleAnalyzerPlugin());
    }
    // GESTION DES LOADERS
    // Loader pour les source-map
    if (parsedEnv.SOURCE_MAPS) {
        config.addComplexLoader(10, {
            test: /\.js$/,
            enforce: 'pre',
            exclude: /node_modules\\css-loader/,
            loader: 'source-map-loader'
        });
    }

    // Default loader pour les fichiers inconnu
    config.addComplexLoader(15, function (env) {
        return {
            exclude: [/\.(js|jsx)$/, /\.(ts|tsx)$/, /\.css$/, /\.scss$/, /\.json$/, /\.(ttf|eot|woff|woff2|svg)(\?.*)?$/, /\.(png|jpg|jpeg|gif)(\?.*)?$/],
            loader: 'file-loader',
            options: {
                limit: env.ASSET_LIMIT,
                name: 'misc/[name]_[sha512:hash:base64:7].[ext]'
            }
        };
    });

    config.addComplexLoader(20, {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader'
    });

    config.addSimpleLoader(30, /\.json$/, 'json-loader');

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

    // Loader pour Babel (transpile ES6 => ES5, exclude des node_modules, attendus en ES5)
    // config.addComplexLoader(20, {
    //     test: /\.(js|jsx)$/,
    //     loader: 'babel-loader',
    //     exclude: /node_modules/,
    //     options: {
    //         cacheDirectory: true,
    //         presets: ['babel-preset-focus']
    //     }
    // });
    // Loader pour le SASS (Extraction du fichier JS, vers un fichier CSS indépendant, cf plugin)
    // Utilisation de PostCss ajouté
    config.addComplexLoader(40, function (env) {
        return {
            test: /\.(css)$/,
            use: _extractTextWebpackPlugin2.default.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: false,
                        // sourceMap: env.SOURCE_MAPS,
                        importLoaders: 1,
                        modules: true,
                        localIdentName: '[path][name]-[local]',
                        getLocalIdent: function getLocalIdent(loaderContext, localIdentName, localName, options) {
                            var name = (0, _getLocalIdent3.default)(loaderContext, localIdentName, localName, options);
                            if (name.includes('focus4')) {
                                return 'focus-' + name.split('-').slice(-3).filter(function (s) {
                                    return s !== '__style__';
                                }).join('-');
                            } else if (name.includes('toolbox')) {
                                return 'rt-' + name.split('-').slice(-3).join('-');
                            } else {
                                return name;
                            }
                        }
                    }
                }, {
                    loader: 'postcss-loader' //,
                    // options: {
                    //Other options should go into postcss.config.js
                    // config: {
                    // path: './postcss.config.js'
                    // },
                    // variableFile: env.CSS_VARIABLE_FILE
                    //sourceMap: env.SOURCE_MAPS
                    // }
                }]
            })
        };
    });

    config.addComplexLoader(45, function (env) {
        return {
            test: /\.(scss)$/,
            use: _extractTextWebpackPlugin2.default.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: false,
                        // sourceMap: env.SOURCE_MAPS,
                        importLoaders: 2
                    }
                }, {
                    loader: 'postcss-loader' //,
                    // options: {
                    //Other options should go into postcss.config.js
                    // config: {
                    // path: './postcss.config.js'
                    // },
                    // variableFile: env.CSS_VARIABLE_FILE
                    //sourceMap: env.SOURCE_MAPS
                    // }
                }, {
                    loader: 'sass-loader',
                    options: {
                        includePaths: _glob2.default.sync('node_modules').map(function (d) {
                            return _path2.default.join(process.cwd(), d);
                        })
                        // sourceMap: env.SOURCE_MAPS
                    }
                }]
            })
        };
    });
    // Loader pour les fonts
    config.addComplexLoader(50, function (env) {
        return {
            test: /\.(ttf|eot|woff|woff2|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: env.ASSET_LIMIT,
                name: 'fonts/[name]_[sha512:hash:base64:7].[ext]'
            }
        };
    });

    // Loader pour les images
    config.addComplexLoader(55, function (env) {
        return {
            test: /\.(png|jpg|jpeg|gif)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: env.ASSET_LIMIT,
                name: 'img/[name]_[sha512:hash:base64:7].[ext]'
            }
        };
    });

    return config;
};

exports.default = baseConfig;
module.exports = exports['default'];