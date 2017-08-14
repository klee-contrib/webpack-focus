import baseConfig from './base'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const tsConfig = (environnement, definedVariables) => {
    const config = baseConfig(environnement, definedVariables);

    const babelLoader = config.removeLoader(20);
    const tsLoader = env => {
        babelLoader.use.push({
            loader: 'ts-loader',
            options: {
                transpileOnly: true // Leave type checking to plugin
            },
            sourceMap: env.SOURCE_MAPS
        });
        return babelLoader;
    };
    config.addComplexLoader(20, tsLoader);

    config.addPlugin(90, new ForkTsCheckerWebpackPlugin({
        tslint: true
    }));

    return config;
}

export default tsConfig;