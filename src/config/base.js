import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';

import ConfigBuilder from '../webpack-utilities/config-builder';
import envParser from '../webpack-utilities/env-parser';

const baseConfig = (environnement, definedVariables) => {

    const parsedEnv = envParser(environnement);

    // Création de la config basique
    const config = new ConfigBuilder();

    config._debugInfo('logEnv', environnement);
    config._debugInfo('logParsedEnv', parsedEnv);

    // Ajout du point d'entrée
    config.addEntry(parsedEnv.ENTRY_FILE_PATH);

    // Ajout des points d'entrée pour le hot reload
    if (parsedEnv.DEV && parsedEnv.HOT_RELOAD) {
        config.addEntry(`webpack-dev-server/client?http://${parsedEnv.DEV_SERVER_HOST}:${parsedEnv.DEV_SERVER_PORT}`);
        config.addEntry('webpack/hot/only-dev-server');
    }

    // Ajout du fichier 
    config.setOuputPath(parsedEnv.OUTPUT_DIR, true);
    config.setAssetsPublicPath(parsedEnv.OUTPUT_PUBLIC_PATH);
    config.setFilename(parsedEnv.npm_package_name);
    config.useSourceMaps(parsedEnv.SOURCE_MAPS);

    // Ajout des variables injectées
    config.addDefinedVariable('__DEV__', parsedEnv.DEV ? 'true' : 'false');
    config.addDefinedVariable('__ANCHOR_CLASS__', JSON.stringify(parsedEnv.ANCHOR_CLASS));
    config.addDefinedVariable('__PACKAGE_JSON_PATH__', JSON.stringify(parsedEnv.PACKAGE_JSON_PATH));
    // config.addDefinedVariable('__USER__', JSON.stringify(USER));
    config.addDefinedVariable('__PROJECT__', JSON.stringify(parsedEnv.npm_package_name));
    config.addDefinedVariable('LEGACY_SEARCH_API', JSON.stringify(parsedEnv.LEGACY_SEARCH_API));
    config.addDefinedVariable('process.env.NODE_ENV', JSON.stringify(parsedEnv.NODE_ENV));

    for (let prop in definedVariables) {
        config.addDefinedVariable(prop, definedVariables[prop]);
    }
    // GESTION DES PLUGINS
    // Les fonctions seront résolues au moment de la création de la config webpack.
    config.addPlugin(10, () => new webpack.DefinePlugin(config.getDefinedVariables()));
    config.addPlugin(20, () => new ExtractTextPlugin(config.getCssFilename()));
    // Gestion du HOT_RELOAD
    if (parsedEnv.DEV && parsedEnv.HOT_RELOAD) {
        config.addPlugin(30, new webpack.HotModuleReplacementPlugin());
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
        config.addPlugin(50, env => new webpack.optimize.UglifyJsPlugin({
            compressor: {
                screw_ie8: true,
                warnings: false,
                drop_console: env.DROP_CONSOLE,
                drop_debugger: true,
                passes: 2
            }
        }));
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
    // Loader pour Babel (transpile ES6 => ES5, exclude des node_modules, attendus en ES5)
    config.addComplexLoader(20, {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
            presets: ['babel-preset-focus']
        }
    });
    // Loader pour le SASS (Extraction du fichier JS, vers un fichier CSS indépendant, cf plugin)
    // Utilisation de PostCss ajouté
    config.addComplexLoader(30, env => ({
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                {
                    loader: 'css-loader',
                    options: {
                        minimize: env.MINIMIFY ? { safe: true, sourcemap: false } : false,
                        sourceMap: false,
                        importLoaders: 1
                    }
                },
                'postcss-loader', // Options should go into postcss.config.js
                'sass-loader'
            ]
        })
    }));
    // Loader pour le CSS (Extraction du fichier JS, vers un fichier CSS indépendant, cf plugin)
    // Utilisation de PostCss ajouté
    config.addComplexLoader(40, env => ({
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                {
                    loader: 'css-loader',
                    options: {
                        minimize: env.MINIMIFY ? { safe: true, sourcemap: false } : false,
                        sourceMap: false,
                        importLoaders: 1
                    }
                },
                'postcss-loader' // Options should go into postcss.config.js
            ]
        })
    }));
    // Loader pour les ressources externes
    config.addSimpleLoader(50, /\.(png|jpg|jpeg|gif|ttf|eot|woff|woff2|svg)(\?.*)?$/, 'url-loader', {
        limit: 50000,
        name: '[name]_[sha512:hash:base64:7].[ext]'
    });

    return config;
};

export default baseConfig;
