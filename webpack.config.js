const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const createElectronReloadWebpackPlugin = require('electron-reload-webpack-plugin');

const buildPath = 'build'; //build path
const ElectronReloadWebpackPlugin = createElectronReloadWebpackPlugin({
    // Path to `package.json` file with main field set to main process file path, or just main process file path
    path: path.join(__dirname, buildPath, './main.js'),
    // or just `path: './'`,
    // Other 'electron-connect' options
    logLevel: 0
});


const IMAGE_TYPES = /\.(png|jpe?g|gif|svg)$/i;

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return [
        {
            entry: {
                main: './src/main.js', // Entry point for the main process
            },
            output: {
                filename: '[name].js',
                path: path.resolve(__dirname, buildPath),
            },
            target: 'electron-main',
            stats: {
                all: false,
                errors: true,
                builtAt: true,
                assets: true,
                excludeAssets: [IMAGE_TYPES],
            },
            node: {
                __dirname: false,
                __filename: false,
            },
            // Additional configuration options for loaders, plugins, etc. can be added here
            plugins: [
                !isProduction && ElectronReloadWebpackPlugin(), // hot reaload

            ].filter(Boolean),
        },
        {
            entry: {
                renderer: './src/renderer.js', // Entry point for the renderer process
            },
            output: {
                filename: '[name].js',
                path: path.resolve(__dirname, buildPath),
                publicPath: './',
                assetModuleFilename: 'images/[hash][ext][query]'
            },
            target: 'electron-renderer',
            stats: {
                all: false,
                errors: true,
                builtAt: true,
                assets: true,
                excludeAssets: [IMAGE_TYPES],
            },
            module: {
                rules: [
                    // Help webpack in understanding CSS files imported in .js files
                    {
                        test: /\.css$/,
                        use: [MiniCssExtractPlugin.loader, 'css-loader'],
                    },
                    // html loader
                    {
                        test: /\.html$/i,
                        loader: "html-loader",
                    },
                    // asset loader
                    {
                        test: IMAGE_TYPES,
                        type: 'asset/resource'
                    }
                ],
            },
            // Additional configuration options for loaders, plugins, etc. can be added here
            plugins: [
                !isProduction && ElectronReloadWebpackPlugin('electron-renderer'), // hot reaload

                // Copy static assets from `public` folder to `build` folder
                new CopyWebpackPlugin({
                    patterns: [{
                        from: '*',
                        context: 'public',
                    }],
                }),
                // Extract CSS into separate files
                new MiniCssExtractPlugin({
                    filename: '[name].css',
                }),
                new webpack.ExternalsPlugin('commonjs', [
                    'electron'
                ]),
                new HtmlWebpackPlugin({
                    template: "./src/index.html"
                }),
            ].filter(Boolean)
        }
    ]

}