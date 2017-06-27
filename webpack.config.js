const webpack = require("webpack");
const path = require("path");
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const DEV = path.resolve(__dirname, "src/script/");
const OUTPUT = path.resolve(__dirname, "src/dist/script/");

module.exports = {
    devtool: '#source-map',
    entry: {
        bundle: DEV + "/index.js",
        vendor: ['jquery']
    },
    output: {
        path: OUTPUT,
        filename: "[name].js"
            // filename: "[name]-[chunkHash:8].js"
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            include: DEV,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?modules&localIdentName=[local]' })
                // loader: 'style!css?modules&localIdentName=[name]__[local]-[hash:base64:5]'
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader?sourceMap' })
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192'
        }]
    },
    resolve: {
        extensions: ['.js', '.json', '.scss', '.css']
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     mangle: {
        //         except: ['$super', '$', 'exports', 'require']
        //     },
        //     output: {
        //         comments: false
        //     },
        //     compress: {
        //         warnings: false
        //     }
        // }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            // names: ['vendor', 'manifest'],
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
        }),
        new CleanWebpackPlugin(
            ['*'], {
                root: OUTPUT,
                verbose: true,
                dry: false
            }
        ),
        // new AssetsPlugin({
        //     filename: 'src/dist/webpack.assets.js',
        //     update: true,
        //     prettyPrint: true,
        //     processOutput: function(assets) {
        //         return 'window.WEBPACK_ASSETS = ' + JSON.stringify(assets);
        //     }
        // }),
        new ExtractTextPlugin("[name]-[chunkHash:8].css")
    ]
};
