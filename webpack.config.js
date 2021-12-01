
var path    = require('path');
var hwp     = require('html-webpack-plugin');
const webpack = require("webpack");

module.exports = {
    mode: "production",
    entry: path.join(__dirname, '/src/index.js'),
    output: {
        filename: 'react.js',
        path:path.join(__dirname, '/build/')
    },
    module:{
        rules:[
            {
                exclude: /node_modules/,
                test: /\.js$/,
                loader: "babel-loader",
                options: {
                    presets: [
                        "@babel/preset-env",
                        {
                            plugins: ["@babel/plugin-proposal-class-properties"]
                        }
                    ]
                }
            },
            {
                test: /\.csv$/,
                loader: 'csv-loader',
                options: {
                    dynamicTyping: true,
                    header: true,
                    skipEmptyLines: true
                }
            },
            {
                test: /\.(eot|woff|woff2|svg|ttf|txt)([\?]?.*)$/,
                use: ['file-loader']
            },

            {
                test: /\.css$/,
                use: ["css-loader"]
            },
            {
                test: /\.(eot|woff|woff2|svg|ttf|txt)([\?]?.*)$/,
                use: ["file-loader"]
            },
            {
                test: /\.scss$/,
                // test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,

                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    'resolve-url-loader',
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
                loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
            }



            ]
    },
    plugins:[
        new webpack.IgnorePlugin(/^pg-native$/),
        new webpack.DefinePlugin({
            "process.env.BROWSER": false,
            __DEV__: process.env.NODE_ENV !== "production"
        }),
        new hwp({template:path.join(__dirname, '/src/index.html')})
    ]
}