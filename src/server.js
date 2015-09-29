const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

/**
 * Generate a webpack developement server.
 * @param  {object} - The server configuration (port, public path from output)
 * @return {object} - A webpack developement server.
 */
function generateServer(config= {}){
    const {output, port} = config;
    return new WebpackDevServer(webpack(config), {
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
