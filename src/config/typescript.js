import baseConfig from "./base";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { getLocalIdent } from "css-loader/dist/utils";

import cssLoaderBuilder from "../webpack-utilities/css-loader-builder";
import envParser from "../webpack-utilities/env-parser";

const tsConfig = (environnement, definedVariables) => {
    const config = baseConfig(environnement, definedVariables);
    const parsedEnv = envParser(environnement);

    config.addExtension([".ts", ".tsx"]);

    const babelLoader = config.removeLoader(20);
    babelLoader.test = /\.(ts|tsx)$/;
    babelLoader.exclude = /node_modules/;
    const tsLoader = _env => {
        babelLoader.use.push({
            loader: "ts-loader",
            options: {
                transpileOnly: true // Leave type checking to plugin
            }
        });
        return babelLoader;
    };
    config.addComplexLoader(20, tsLoader);

    // Removing css and postcss loader
    config.removeLoader(30);
    // Adding separate loader and conf
    const cssOptions = {
        modules: true,
        localIdentName: "[path][name]-[local]",
        getLocalIdent: (context, localIdentName, localName, options) => {
            const name = getLocalIdent(context, localIdentName, localName, options);
            if (name.includes("focus4")) {
                return `focus-${name
                    .split("-")
                    .slice(-3)
                    .filter(s => s !== "__style__")
                    .join("-")}`;
            } else if (name.includes("toolbox")) {
                return `rt-${name
                    .split("-")
                    .slice(-3)
                    .join("-")}`;
            } else {
                return name;
            }
        }
    };

    config.addComplexLoader(30, cssLoaderBuilder(parsedEnv, cssOptions, false, true));
    config.addComplexLoader(40, cssLoaderBuilder(parsedEnv, {}, true, false));

    config.addPlugin(
        90,
        env =>
            new ForkTsCheckerWebpackPlugin({
                tslint: true,
                async: env.HOT_RELOAD
            })
    );

    return config;
};

export default tsConfig;
