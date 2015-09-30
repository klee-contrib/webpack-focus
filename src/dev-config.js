import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';
/**
* Generate a webpack developement configuration
* @param  {object} spec - The config specification.
* @return {object}      A json object of the developer configuration.
*/
function generateConfiguration(spec = {}){
    spec.plugins = spec.plugins || [];
    spec.loaders = spec.loaders || [];
    const {devtool, entry, name, directory, output, loaders, plugins, port, ...otherConf} = spec;

    const devConfig =  {
        devtool: devtool || 'eval',
        entry: [
            `webpack-dev-server/client?http://localhost:${port}`,
            'webpack/hot/only-dev-server',
            ...entry
        ],
        output: output,
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            ...plugins
        ],
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loaders: ['react-hot', 'babel'],
                    include: directory || path.join(__dirname, 'src')
                },{
                    test: /\.json$/,
                    loaders: ['json']
                }, {
                    test: /\.scss$/,
                    loader: 'style!css!sass'
                },{
                    test: /\.png$/,
                    loader: 'url-loader',
                    query: { mimetype: 'image/png' }
                },{
                    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url?limit=10000&mimetype=application/font-woff'
                },{
                    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url?limit=10000&mimetype=application/font-woff'
                }, {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url?limit=10000&mimetype=application/octet-stream'
                }, {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'file'
                }, {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url?limit=10000&mimetype=image/svg+xml'
                },
                ...loaders
            ]
        },
        ...otherConf
    }
    //console.log('%j', devConfig.module.loaders);
    return devConfig;
}
export default generateConfiguration;
