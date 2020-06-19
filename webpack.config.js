const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const autoprefixer = require("autoprefixer");
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        "index": "./src/index.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[contenthash].bundle.js"
    },
    devServer: {
        // contentBase: path.join(__dirname, "dist"),
        port: 9000,
        // watchContentBase: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        new HtmlWebpackPlugin({
            template: './src/kontakt.html',
            inject: true,
            chunks: ['index'],
            filename: 'kontakt.html'
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css"
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 9100,
            proxy: 'http://localhost:9000'
        }, {
            reload: false
        }),
        new CopyWebpackPlugin([{
            from: './src/assets',
            to: './dest/assets'
        }]),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer
                ]
            }
        })
    ],
    module: {
        rules: [{
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: ['@babel/preset-env']
            //         }
            //     }
            // },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "./assets/img/[name].[ext]"
                    }
                }

            },
            {
                test: /\.(html)$/,
                use: ['html-loader'],
                // use: [{
                //     loader: 'html-loader',
                //     options: {
                //         name: "[name].[ext]",
                //         outputPath: "./pages"
                //     }
                // }],
                // exclude: path.resolve(__dirname, './src/index.html')
            }
        ]
    }
}