const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

module.exports = {
    module: {
        rules: [
            {
                //=== This option convert js ES6 in ES5
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                //=== This option convert sass in css
                test: /\.(sa|sc|c)ss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                //=== This option allows you to load the images
                test: /\.(jpg|png|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    publicPath: (url, resourcePath, context) => {

                        if (/clouds\.png/.test(resourcePath)) {
                            return `./img/${url}`;
                        }

                        if (/stars\.jpg/.test(resourcePath)) {
                            return `./img/${url}`;
                        }

                        return `./assets/img/${url}`;
                    },
                    outputPath: './img/'
                }
            },
            {
                //=== This option minimize and load the html
                test: /\.html$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: true }
                    }
                ]
            }
        ]
    },
    optimization: {
        //=== To minify css and js
        minimizer: [
            new TerserPlugin(),
            new OptimizeCssAssetsPlugin({})
        ]
    },
    devServer: {
        publicPath: '/assets/',
        contentBase: './',
        watchContentBase: true,
        compress: true
    },
    plugins: [
        //=== To convert sass in css and insert it in the assets folder
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        //=== To convert and generate another html in the root
        new HtmlWebPackPlugin({
            alwaysWriteToDisk: true,
            template: './src/html/index.html',
            filename: '../index.html',
            hash: true
        }),
        new HtmlWebpackHarddiskPlugin()
    ]
};