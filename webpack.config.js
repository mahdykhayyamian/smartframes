var webpack = require('webpack');
var path = require('path');

var PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
    entry:  __dirname + '/src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'smart-frames.js',
        library: 'smartframes',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                options: { presets: ['es2015'] }
            }],
        }]
    },
    plugins: PROD ? [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
    ] : [],
    resolve: {
        modules: [__dirname, 'client','node_modules']
    }
};