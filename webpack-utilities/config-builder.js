'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var entryError = 'Le point d\'entr\xE9e correspond au point d\'entr\xE9e dans la SPA,\nle param\xE8tre devrait \xEAtre une chaine de caract\xE8re correspondant au fichier de lancement de l\'application, ou \xE0 son dossier si c\'est un index.js\nPar exemple (et par d\xE9faut) path.resolve(process.cwd(), \'./src\'), c\xE0d le dossier src du dossier courant';

/**
 * Classe pour construire une configuration de façon simple, et modulable.
 * 
 * @class ConfigBuilder
 */

var ConfigBuilder = function () {
    function ConfigBuilder() {
        _classCallCheck(this, ConfigBuilder);

        this.configEnv = {};
        this.entries = [];
        this.output = {
            libraryTarget: 'umd'
        };
        this.devtool = false;
        this.stats = {};
        this.plugins = [];
        this.loaders = [];
        this.extensions = ['.js', '.jsx', '.json'];
        this.rules = [];
        this.debugConfig = true;
        this.sourceMaps = false;
        this.externals = {};
        this.definedVariables = {};
        this.projectName = null;
        this.aliases = {};
    }

    ConfigBuilder.prototype._debugInfo = function _debugInfo() {
        if (this.debugConfig) {
            console.log('########################################################################');
            console.log(arguments);
            console.log('########################################################################');
            console.log();
        }
    };

    /**
     * Ajoute un point d'entrée dans l'application 
     * Cf https://webpack.js.org/configuration/entry-context/#entry
     * 
     * @param {Array|string} entry Le chemin indiquant le point d'entrée de l'application (relatif, ou absolu), par exemple path.resolve(process.cwd(), './src'), ou path.resolve(process.cwd(), './src/index.js'), ou './src'
     * 
     * @memberOf ConfigBuilder
     */


    ConfigBuilder.prototype.addEntry = function addEntry(entry) {
        this._debugInfo('setOuputPath', [].concat(Array.prototype.slice.call(arguments)));
        if ((0, _lodash.isArray)(entry)) {
            var _entries;

            (_entries = this.entries).push.apply(_entries, _toConsumableArray(entry));
        } else if ((0, _lodash.isString)(entry)) {
            this.entries.push(entry);
        } else {
            throw new Error(entryError);
        }
    };

    /**
     * Indique le dossier de sortie du build webpack.
     * Cf https://webpack.js.org/configuration/output/#output-path
     * 
     * @param {string} outPath Le path pour le dossier d'output
     * @param {boolean} [isRelative=true] Indique si le path donnée est relatif par rapport au dossier du projet (par défaut), ou absolu.
     * 
     * @memberOf ConfigBuilder
     */


    ConfigBuilder.prototype.setOuputPath = function setOuputPath(outPath) {
        var isRelative = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        this._debugInfo('setOuputPath', [].concat(Array.prototype.slice.call(arguments)));
        this.output.path = isRelative ? _path2.default.resolve(process.cwd(), outPath) : outPath;
    };

    /**
     * Ajoute un alias pour la résolution des sources (ex: test focus, etc).
     * Cf https://webpack.js.org/configuration/resolve/#resolve-alias
     * 
     * @param {any} aliasName le nom de l'alias
     * @param {any} aliasPath le path du dossier/fichier pour la résolution
     * @param {boolean} [isRelative=true] Indique si le path donnée est relatif par rapport au dossier du projet (par défaut), ou absolu.
     * 
     * @memberOf ConfigBuilder
     */


    ConfigBuilder.prototype.addAlias = function addAlias(aliasName, aliasPath) {
        var isRelative = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        this._debugInfo('setOuputPath', [].concat(Array.prototype.slice.call(arguments)));
        this.output.path = isRelative ? _path2.default.resolve(process.cwd(), aliasPath) : aliasPath;
    };

    /**
     * Indique le dossier contenant les assets servies par la SPA (css, images, ...).
     * Cf https://webpack.js.org/configuration/output/#output-publicpath
     * 
     * @param {string} path Le path pour le dossier d'assets
     * 
     * @memberOf ConfigBuilder
     */


    ConfigBuilder.prototype.setAssetsPublicPath = function setAssetsPublicPath(path) {
        this._debugInfo('setAssetsPublicPath', [].concat(Array.prototype.slice.call(arguments)));
        this.output.publicPath = path;
    };

    /**
     * Indique le nom du fichier d'output, sans l'extension. Peut contenir [name], [id] et [contenthash]
     * Cf https://webpack.js.org/configuration/output/#output-filename
     * Cf https://github.com/webpack-contrib/extract-text-webpack-plugin
     * 
     * @param {string} name le nom du fichier JS et CSS sans l'extension (par défault, le nom du package NPM :`${npm_package_name}`)
     * 
     * @memberOf ConfigBuilder
     */


    ConfigBuilder.prototype.setFilename = function setFilename(name) {
        this._debugInfo('setFilename', [].concat(Array.prototype.slice.call(arguments)));
        this.projectName = name;
        this.output.filename = this.projectName + '.js';
    };

    /**
     * Ajoute une extension dans la liste des extensions automatiquement résolues (par défaut, .js, .jsx, .json).
     * Cf https://webpack.js.org/configuration/resolve/#resolve-extensions
     * 
     * @param {string} extension une extension à résoudre automatiquement
     * 
     * @memberOf ConfigBuilder
     */


    ConfigBuilder.prototype.addExtension = function addExtension(extension) {
        this._debugInfo('addExtension', [].concat(Array.prototype.slice.call(arguments)));
        if ((0, _lodash.isArray)(extension)) {
            var _extensions;

            (_extensions = this.extensions).push.apply(_extensions, _toConsumableArray(extension));
        } else if ((0, _lodash.isString)(extension)) {
            this.extensions.push(extension);
        } else {
            throw new Error('Une extension est soit une chaine de caractère, soit tableau de chaine de caractère');
        }
    };

    ConfigBuilder.prototype._getInsertIndex = function _getInsertIndex(orderedList, newOrdre) {
        return orderedList.findIndex(function (_ref) {
            var ordre = _ref.ordre;
            return ordre > newOrdre;
        });
    };

    ConfigBuilder.prototype._insertElt = function _insertElt(orderedList, newElt) {
        var index = this._getInsertIndex(orderedList, newElt.ordre);
        if (index === -1) {
            // L'élément a l'ordre le plus grand
            orderedList.push(newElt);
        } else {
            // Sinon, on injecte juste avant le plugin ayant un ordre plus élevé
            orderedList.splice(index, 0, newElt);
        }
    };
    /**
     * Ajoute un plugin à la configuration webpack, à la position indiquée.
     * Cf https://webpack.js.org/configuration/plugins/#plugins
     * 
     * @param {int} ordre la position dans la liste des plugins (les plugins par défaut sont espacés de 10, pour permettre l'injection)
     * @param {any} plugin Le plugin webpack à insérer
     * 
     * @memberOf ConfigBuilder
     */


    ConfigBuilder.prototype.addPlugin = function addPlugin(ordre, plugin) {
        this._debugInfo('addPlugin', [].concat(Array.prototype.slice.call(arguments)));
        this._insertElt(this.plugins, { ordre: ordre, plugin: plugin });
    };

    /**
     * Ajoute un loader/Rule simple à la configuration webpack, à la position indiquée.
     * Cf https://webpack.js.org/configuration/module/#rule
     * Cf https://webpack.js.org/configuration/module/#rule-loader
     * Cf https://webpack.js.org/configuration/module/#rule-use
     * 
     * @param {int} ordre la position dans la liste des loaders (les loaders par défaut sont espacés de 10, pour permettre l'injection)
     * @param {RegExp} test le test pour matcher ou non le fichier
     * @param {string} loader le nom du loader
     * @param {object} [options=null] un objet d'options, pour le loader
     * @param {boolean} [isPreloader=false] si le loader est un pre-loader
     * 
     * @memberOf ConfigBuilder
     */


    ConfigBuilder.prototype.addSimpleLoader = function addSimpleLoader(ordre, test, loader) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var isPreloader = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

        this._debugInfo('addSimpleLoader', [].concat(Array.prototype.slice.call(arguments)));
        var newLoader = { ordre: ordre, loader: { test: test, loader: loader } };
        if (options !== null) {
            newLoader.loader.options = options;
        }
        if (isPreloader) {
            newLoader.loader.enforce = 'pre';
        }
        this._insertElt(this.loaders, newLoader);
    };

    /**
     * Ajoute un loader/Rule à la configuration webpack, à la position indiquée.
     * Cf https://webpack.js.org/configuration/module/#rule
     * Cf https://webpack.js.org/configuration/module/#rule-loader
     * Cf https://webpack.js.org/configuration/module/#rule-use     * 
     * @param {int} ordre la position dans la liste des loaders (les loaders par défaut sont espacés de 10, pour permettre l'injection)
     * @param {object} rule l'objet 
     * 
     * @memberOf ConfigBuilder
     */


    ConfigBuilder.prototype.addComplexLoader = function addComplexLoader(ordre, rule) {
        this._debugInfo('addComplexLoader', [].concat(Array.prototype.slice.call(arguments)));
        var newLoader = { ordre: ordre, loader: rule };
        this._insertElt(this.loaders, newLoader);
    };

    /**
     * Indique si les sourcemaps doivent être utilisé ou non.
     * 
     * @param {boolean} useSourceMaps si les sourcemaps doivent être utilisé ou non.
     * 
     * @memberOf ConfigBuilder
     */


    ConfigBuilder.prototype.useSourceMaps = function useSourceMaps() {
        var _useSourceMaps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        this._debugInfo('useSourceMaps', [].concat(Array.prototype.slice.call(arguments)));
        this.sourceMaps = _useSourceMaps;
    };

    /**
     * Ajoute une variable qui sera définie par le plugin DefineVariable, et injectée (càd remplacée par sa valeur) par webpack.
     * Note : Il est nécessaire d'utiliser getDefinedVariables dans le cas d'une configuration non basée sur celle par défaut.
     * 
     * @param {string} key le nom de la variable
     * @param {string} value la valeur de la variable
     * 
     * @memberOf ConfigBuilder
     */


    ConfigBuilder.prototype.addDefinedVariable = function addDefinedVariable(key, value) {
        this.definedVariables[key] = value;
    };

    /**
     * Retourne un objet de config pour le plugin webpack.DefinePlugin.
     * 
     * @returns {object} l'objet de config pour le plugin DefinePlugin
     * 
     * @memberOf ConfigBuilder
     */


    ConfigBuilder.prototype.getDefinedVariables = function getDefinedVariables() {
        return this.definedVariables;
    };

    /**
     * Retourne le nom du fichier css (pour ExtractTextPlugin).
     * 
     * @returns {string} le nom du fichier css
     * 
     * @memberOf ConfigBuilder
     */


    ConfigBuilder.prototype.getCssFilename = function getCssFilename() {
        return this.projectName + '.css';
    };

    /**
     * Ajoute un external à la configuration webpack, càd un nom qui sera résolu de manière global (jQuery, Backbone, ...)
     * Cf https://webpack.js.org/configuration/externals/
     * 
     * @param {string} key le nom de la variable
     * @param {string|object} value la valeur à résoudre dans le bundle au runtime (peut être par type de lib), cf doc webpack
     * 
     * @memberOf ConfigBuilder
     */


    ConfigBuilder.prototype.addExternal = function addExternal(key, value) {
        this.externals[key] = value;
    };

    ConfigBuilder.prototype._buildConfig = function _buildConfig(env) {
        return {
            entry: this.entries,
            output: this.output,
            devtool: this.useSourceMaps ? 'source-map' : false,
            resolve: {
                extensions: this.extensions
            },
            plugins: this.plugins.map(function (_ref2) {
                var plugin = _ref2.plugin;
                return plugin;
            }).map(function (item) {
                return (0, _lodash.isFunction)(item) ? item(env) : item;
            }),
            module: {
                rules: this.loaders.map(function (_ref3) {
                    var loader = _ref3.loader;
                    return loader;
                }).map(function (item) {
                    return (0, _lodash.isFunction)(item) ? item(env) : item;
                })
            },
            externals: this.externals,
            stats: {
                colors: true,
                version: false,
                timings: false,
                assets: false,
                chunks: false,
                modules: false,
                reasons: false,
                children: false,
                source: false,
                errors: true,
                errorDetails: true,
                warnings: true
            }
        };
    };

    /**
     * Construit l'objet de configuration webpack.
     * 
     * @param {object} [env={}] une object contenant des valeurs pour la résolution des plugins et loaders.
     * @param {object} [customConf={}] une configuration custom, pouvant être mergée avec la conf buildée.
     * @returns {object} la configuration buildée, et mergée
     * 
     * @memberOf ConfigBuilder
     */


    ConfigBuilder.prototype.toWebpackConfig = function toWebpackConfig() {
        var env = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var customConf = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        return (0, _lodash.defaultsDeep)(customConf, this._buildConfig(env));
    };

    return ConfigBuilder;
}();

exports.default = ConfigBuilder;
module.exports = exports['default'];