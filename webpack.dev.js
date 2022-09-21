const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
    // post build configuration
    const useCopyPlugin = env.copy !== undefined;

    const plugins = [];

    if (useCopyPlugin) {
        // Copy assets from @arcgis and @esri to dist/assets
        plugins.push(new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/Workers'),
                    to: path.join(__dirname, 'dist/Workers')
                },
                {
                    from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/ThirdParty'),
                    to: path.join(__dirname, 'dist/ThirdParty')
                },
                {
                    from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/Assets'),
                    to: path.join(__dirname, 'dist/Assets')
                },
                {
                    from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/Widgets'),
                    to: path.join(__dirname, 'dist/Widgets')
                },
                // tiles data
                {
                    from: path.join(__dirname, 'src/assets/tiles'),
                    to: path.join(__dirname,'dist/tiles')
                }
            ]
        }));
    }

    // define a mode flag for common configuration
    const envForCommon = {
        production: false,
    }

    return merge(common(envForCommon), {
        mode: 'development',
        devtool: 'inline-source-map',
        // A development server for serving up our files
        devServer: {
            static: path.join(__dirname, 'dist'),
            port: 3000,
            host: 'localhost',
            // With this enabled, page refreshes automatically when rebuilt
            hot: true,
            // Need to copy assets to dist, so force the dev server to write to disk
            devMiddleware: {
                index: true,
                publicPath: '/',
                writeToDisk: true,
            },
        },
        plugins
    });
}