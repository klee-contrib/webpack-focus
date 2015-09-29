import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';
/**
* Generate a webpack developement configuration
* @param  {object} spec - The config specification.
* @return {object}      A json object of the developer configuration.
*/
function generateConfiguration(spec = {}){
    const {devtool, entry, name, directory, output} = spec;
    return {
        devtool: devtool || 'eval',
        entry: [
            'webpack-dev-server/client?http://localhost:3001',
            'webpack/hot/only-dev-server',
            ...entry
        ],
        output: output,
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ],
        module: {
            loaders: [{
                test: /\.js$/,
                loaders: ['react-hot', 'babel'],
                include: directory || path.join(__dirname, 'src')
            }, {
                test: /\.json$/,
                loaders: ['json']
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            }]
        }
    }
}
export default generateConfiguration;
