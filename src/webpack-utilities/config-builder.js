import path from "path";
import defaultsDeep from "lodash/defaultsDeep";

const entryError = `Le point d'entrée correspond au point d'entrée dans la SPA,
le paramètre devrait être une chaine de caractère correspondant au fichier de lancement de l'application, ou à son dossier si c'est un index.js
Par exemple (et par défaut) path.resolve(process.cwd(), './src'), càd le dossier src du dossier courant`;

/**
 * Classe pour construire une configuration de façon simple, et modulable.
 *
 * @class ConfigBuilder
 */
class ConfigBuilder {
    configEnv = {};
    entries = [];
    output = {
        // libraryTarget: 'umd'
    };
    devtool = false;
    stats = {};
    plugins = [];
    loaders = [];
    extensions = [".js", ".jsx"];
    rules = [];
    debugConfig = false;
    sourceMaps = false;
    externals = {};
    definedVariables = {};
    projectName = null;
    aliases = {};

    _debugInfo() {
        if (this.debugConfig) {
            console.log("########################################################################");
            console.log(arguments);
            console.log("########################################################################");
            console.log();
        }
    }

    /**
     * Ajoute un point d'entrée dans l'application
     * Cf https://webpack.js.org/configuration/entry-context/#entry
     *
     * @param {Array|string} entry Le chemin indiquant le point d'entrée de l'application (relatif, ou absolu), par exemple path.resolve(process.cwd(), './src'), ou path.resolve(process.cwd(), './src/index.js'), ou './src'
     *
     * @memberOf ConfigBuilder
     */
    addEntry(entry) {
        this._debugInfo("addEntry", [...arguments]);
        if (Array.isArray(entry)) {
            this.entries.push(...entry);
        } else if (typeof entry === "string") {
            this.entries.push(entry);
        } else {
            throw new Error(entryError);
        }
    }

    /**
     * Indique le dossier de sortie du build webpack.
     * Cf https://webpack.js.org/configuration/output/#output-path
     *
     * @param {string} outPath Le path pour le dossier d'output
     * @param {boolean} [isRelative=true] Indique si le path donnée est relatif par rapport au dossier du projet (par défaut), ou absolu.
     *
     * @memberOf ConfigBuilder
     */
    setOuputPath(outPath, isRelative = true) {
        this._debugInfo("setOuputPath", [...arguments]);
        this.output.path = isRelative ? path.resolve(process.cwd(), outPath) : outPath;
    }

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
    addAlias(aliasName, aliasPath, isRelative = true) {
        this._debugInfo("addAlias", [...arguments]);
        this.aliases[aliasName] = isRelative ? path.resolve(process.cwd(), aliasPath) : aliasPath;
    }

    /**
     * Indique le dossier contenant les assets servies par la SPA (css, images, ...).
     * Cf https://webpack.js.org/configuration/output/#output-publicpath
     *
     * @param {string} path Le path pour le dossier d'assets
     *
     * @memberOf ConfigBuilder
     */
    setAssetsPublicPath(path) {
        this._debugInfo("setAssetsPublicPath", [...arguments]);
        this.output.publicPath = path;
    }

    /**
     * Indique le nom des chunk en cas de require.ensure.
     * @param {string} name
     */
    setChunkFileName(name) {
        this._debugInfo("setChunkFileName", [...arguments]);
        this.output.chunkFilename = name;
    }

    /**
     * Indique le nom du fichier d'output, sans l'extension. Peut contenir [name], [id] et [contenthash]
     * Cf https://webpack.js.org/configuration/output/#output-filename
     * Cf https://github.com/webpack-contrib/extract-text-webpack-plugin
     *
     * @param {string} name le nom du fichier JS et CSS sans l'extension (par défault, le nom du package NPM :`${npm_package_name}`)
     *
     * @memberOf ConfigBuilder
     */
    setFilename(name) {
        this._debugInfo("setFilename", [...arguments]);
        this.projectName = name;
        this.output.filename = this.projectName + ".js";
    }

    /**
     * Ajoute une extension dans la liste des extensions automatiquement résolues (par défaut, .js, .jsx, .json).
     * Cf https://webpack.js.org/configuration/resolve/#resolve-extensions
     *
     * @param {string} extension une extension à résoudre automatiquement
     *
     * @memberOf ConfigBuilder
     */
    addExtension(extension) {
        this._debugInfo("addExtension", [...arguments]);
        if (Array.isArray(extension)) {
            this.extensions.push(...extension);
        } else if (typeof extension === "string") {
            this.extensions.push(extension);
        } else {
            throw new Error("Une extension est soit une chaine de caractère, soit tableau de chaine de caractère");
        }
    }

    _getInsertIndex(orderedList, newOrdre) {
        return orderedList.findIndex(({ ordre }) => ordre > newOrdre);
    }

    _getElement(orderedList, eltOrdre) {
        return orderedList.find(({ ordre }) => eltOrdre === ordre);
    }

    _getIndexElement(orderedList, eltOrdre) {
        return orderedList.findIndex(({ ordre }) => eltOrdre === ordre);
    }

    _insertElt(orderedList, newElt) {
        if (this._getIndexElement(orderedList, newElt.ordre) !== -1) {
            throw new Error("Un élément d'ordre " + newElt.ordre + " existe déjà");
        }
        const index = this._getInsertIndex(orderedList, newElt.ordre);
        if (index === -1) {
            // L'élément a l'ordre le plus grand
            orderedList.push(newElt);
        } else {
            // Sinon, on injecte juste avant le plugin ayant un ordre plus élevé
            orderedList.splice(index, 0, newElt);
        }
    }

    _removeElt(orderedList, ordre) {
        const index = this._getIndexElement(orderedList, ordre);
        if (index === -1) {
            console.warn("Aucun élément d'ordre " + ordre + " n'existe, donc aucun élément n'a été retiré");
            return null;
        } else {
            return orderedList.splice(index, 1)[0];
        }
    }

    /**
     * Ajoute un plugin à la configuration webpack, à la position indiquée.
     * Cf https://webpack.js.org/configuration/plugins/#plugins
     *
     * @param {int} ordre la position dans la liste des plugins (les plugins par défaut sont espacés de 10, pour permettre l'injection)
     * @param {any} plugin Le plugin webpack à insérer
     *
     * @memberOf ConfigBuilder
     */
    addPlugin(ordre, plugin) {
        this._debugInfo("addPlugin", [...arguments]);
        this._insertElt(this.plugins, { ordre, plugin });
    }

    /**
     * Retire un plugin à la configuration webpack, à la position indiquée.
     *
     * @param {int} ordre la position dans la liste des plugins
     * @returns {object} l'élément supprimé
     * @memberof ConfigBuilder
     *
     */
    removePlugin(ordre) {
        this._debugInfo("removePlugin", [...arguments]);
        return (this._removeElt(this.plugins, ordre) || {}).plugin;
    }

    /**
     * Accède à un plugin de la configuration webpack, à la position indiquée.
     *
     * @param {int} ordre la position dans la liste des plugins
     * @returns {object} l'élément
     * @memberof ConfigBuilder
     *
     */
    getPlugin(ordre) {
        this._debugInfo("getPlugin", [...arguments]);
        return (this._getElement(this.plugins, ordre) || {}).plugin;
    }

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
    addSimpleLoader(ordre, test, loader, options = null, isPreloader = false) {
        this._debugInfo("addSimpleLoader", [...arguments]);
        const newLoader = { ordre, loader: { test, loader } };
        if (options !== null) {
            newLoader.loader.options = options;
        }
        if (isPreloader) {
            newLoader.loader.enforce = "pre";
        }
        this._insertElt(this.loaders, newLoader);
    }

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
    addComplexLoader(ordre, rule) {
        this._debugInfo("addComplexLoader", [...arguments]);
        const newLoader = { ordre, loader: rule };
        this._insertElt(this.loaders, newLoader);
    }

    /**
     * Retire un loader à la configuration webpack, à la position indiquée.
     *
     * @param {int} ordre la position dans la liste des loaders
     * @returns {object} l'élément supprimé
     * @memberof ConfigBuilder
     *
     */
    removeLoader(ordre) {
        this._debugInfo("removeLoader", [...arguments]);
        return (this._removeElt(this.loaders, ordre) || {}).loader;
    }

    /**
     * Accède à un loader de la configuration webpack, à la position indiquée.
     *
     * @param {int} ordre la position dans la liste des loaders
     * @returns {object} l'élément
     * @memberof ConfigBuilder
     *
     */
    getLoader(ordre) {
        this._debugInfo("getLoader", [...arguments]);
        return (this._getElement(this.loaders, ordre) || {}).loader;
    }

    /**
     * Indique si les sourcemaps doivent être utilisé ou non.
     *
     * @param {boolean} useSourceMaps si les sourcemaps doivent être utilisé ou non.
     *
     * @memberOf ConfigBuilder
     */
    useSourceMaps(useSourceMaps = false) {
        this._debugInfo("useSourceMaps", [...arguments]);
        this.sourceMaps = useSourceMaps;
    }

    /**
     * Ajoute une variable qui sera définie par le plugin DefineVariable, et injectée (càd remplacée par sa valeur) par webpack.
     * Note : Il est nécessaire d'utiliser getDefinedVariables dans le cas d'une configuration non basée sur celle par défaut.
     *
     * @param {string} key le nom de la variable
     * @param {string} value la valeur de la variable
     *
     * @memberOf ConfigBuilder
     */
    addDefinedVariable(key, value) {
        this.definedVariables[key] = value;
    }

    /**
     * Retourne un objet de config pour le plugin webpack.DefinePlugin.
     *
     * @returns {object} l'objet de config pour le plugin DefinePlugin
     *
     * @memberOf ConfigBuilder
     */
    getDefinedVariables() {
        return this.definedVariables;
    }

    /**
     * Retourne le nom du fichier css (pour ExtractTextPlugin).
     *
     * @returns {string} le nom du fichier css
     *
     * @memberOf ConfigBuilder
     */
    getCssFilename() {
        return this.projectName + ".css";
    }

    /**
     * Ajoute un external à la configuration webpack, càd un nom qui sera résolu de manière global (jQuery, Backbone, ...)
     * Cf https://webpack.js.org/configuration/externals/
     *
     * @param {string} key le nom de la variable
     * @param {string|object} value la valeur à résoudre dans le bundle au runtime (peut être par type de lib), cf doc webpack
     *
     * @memberOf ConfigBuilder
     */
    addExternal(key, value) {
        this.externals[key] = value;
    }

    /**
     * Define options used by optimization.
     * @param {object} optimization Optimization options.
     */
    setOptimization(optimization) {
        this.optimization = optimization;
    }

    /**
     * Build configuration.
     * @param {object} env Environment configuration.
     * @returns {object} Configuration.
     */
    _buildConfig(env) {
        const config = {
            mode: env.NODE_ENV,
            entry: this.entries,
            output: this.output,
            resolve: {
                extensions: this.extensions,
                alias: this.aliases
            },
            plugins: this.plugins
                .map(({ plugin }) => plugin)
                .map(item => (typeof item === "function" ? item(env) : item)),
            module: {
                rules: this.loaders
                    .map(({ loader }) => loader)
                    .map(item => (typeof item === "function" ? item(env) : item))
            },
            optimization: {
                minimize: this.optimization.minimize,
                splitChunks: {
                    chunks: this.optimization.splitChunks
                },
                minimizer: this.optimization.minimizer ? [this.optimization.minimizer] : []
            },
            bail: this.optimization.bail,
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

        config.devtool = this.sourceMaps && env.MINIMIFY ? "source-map" : this.sourceMaps ? "eval-source-map" : false;

        return config;
    }

    /**
     * Construit l'objet de configuration webpack.
     *
     * @param {object} [env={}] une object contenant des valeurs pour la résolution des plugins et loaders.
     * @param {object} [customConf={}] une configuration custom, pouvant être mergée avec la conf buildée.
     * @returns {object} la configuration buildée, et mergée
     *
     * @memberOf ConfigBuilder
     */
    toWebpackConfig(env = {}, customConf = {}) {
        return defaultsDeep(customConf, this._buildConfig(env));
    }
}

export default ConfigBuilder;
