const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js',
        publicPath: '/',
        clean: true,
    },
    mode: 'development',
    devtool: 'source-map',
    target: 'web',
    cache: true,
    module: {
        rules: [{
            test: /\.(jsx|js)$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-env"],
                    plugins: ["./my-babel-pluin.js"],
                }
            }
        }],
    },
    resolve: {
        modules: ["./node_modules"],
        extensions: [".js", ".json", ".jsx", ".css"],
    },
    resolve: {
        alias: {
            '@logger': path.resolve(__dirname, "./src/logger.js"),
        }
    },
    plugins: [
        new HtmlWebpackPlugin(),
    ],
};
