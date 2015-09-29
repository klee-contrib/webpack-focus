import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';
/**
* Generate a webpack developement configuration
* @param  {object} spec - The config specification.
* @return {object}      A json object of the developer configuration.
*/
function generateProductionConfiguration(spec = {}){
    const {devtool, entry, name, directory, output, plugins, loaders} = spec;
    return {
        devtool: devtool || 'source-map',
        entry: [
            'webpack-dev-server/client?http://localhost:3001',
            'webpack/hot/only-dev-server',
            ...entry
        ],
        output: output,
        plugins: [
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new webpack.optimize.UglifyJsPlugin({
                compressor: {
                    'screw_ie8': true,
                    warnings: false
                }
            }),
            ...plugins
        ],
        module: {
            loaders: [{
                test: /\.js$/,
                loaders: ['react-hot', 'babel'],
                include: directory || path.join(__dirname, 'src')
            }, {
                test: /\.json$/,
                loaders: ['json']
            }, {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.png$/,
                loader: 'url-loader',
                query: { mimetype: 'image/png' }
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            },
            {
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
        }
    }
}
export default generateProductionConfiguration;
