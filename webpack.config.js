const webpack = require("webpack");
const path = require("path");
const glob = require("glob");
// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

const DEV = path.resolve(__dirname, "src/script/");
const OUTPUT = path.resolve(__dirname, "dist/script/");

var entries = (function() {
    var entryFiles = glob.sync(DEV + '/*.js'),
        map = {};
    var i, len;

    for (i = 0, len = entryFiles.length; i < len; i++) {
        var filePath = entryFiles[i];
        var fileName = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        map[fileName] = filePath;
    }

    return map;
}());

module.exports = {
    devtool: '#source-map',
    entry: Object.assign(entries, {
        'vendor': ['jquery']
    }),
    output: {
        path: OUTPUT,
        filename: "[name].js"
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
            // loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?modules&localIdentName=[local]' })
        }, {
            test: /\.scss$/,
            // loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader?sourceMap' })
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192'
        }]
    },
    resolve: {
        extensions: ['.js', '.json', '.scss', '.css']
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['common', 'vendor'],
            minChunks: 2
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery',
            jQuery: 'jquery'
        }),
        // new CleanWebpackPlugin(
        //     ['*'], {
        //         root: OUTPUT,
        //         verbose: true,
        //         dry: false
        //     }
        // ),
        // new ExtractTextPlugin("[name]-[chunkHash:8].css")
    ]
};