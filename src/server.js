const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
import devConfig from './dev-config';
import productionConfig from './production-config';
/**
 * Generate a webpack developement server.
 * @param  {object} - The server configuration (port, public path from output)
 * @return {object} - A webpack developement server.
 */
function generateServer(config= {}){
    const generatedConf = config.isProd ? productionConfig(config) : devConfig(config);
    const {output, port} = config;
    return new WebpackDevServer(webpack(generatedConf), {
        publicPath: output.publicPath,
        hot: true,
        historyApiFallback: true
    }).listen(port, 'localhost', (err) => {
        if (err) {
            console.log(err);
        }
        console.log(`Listening at localhost:${port}`);
    });
}

export default generateServer;
