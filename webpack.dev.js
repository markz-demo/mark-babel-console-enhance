const path = require('path');
const { merge } = require('webpack-merge');
const config = require('./webpack.config.js');

module.exports = merge(config, {
    output: {
        path: path.resolve(__dirname, "public"),
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, "public"),
        },
        host: '0.0.0.0',
        port: 3000,
        compress: true,
        hot: true,
        historyApiFallback: true,
    }
});
