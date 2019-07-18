const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './src/index.html'),
            filename: 'index.html'
        })
    ],
    module: {
        rules: [
            // css modules
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]__[hash:5]'
                            }
                        }
                    }
                ],
                include: /\/src\//
            },
            // css
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            // imgs
            {
                test: /\.(jpg|bmp|gif|png|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        name: '[name]__[hash:5].[ext]'
                    }
                },
                include: /\/src\/imgs\//
            },
            // fonts
            {
                test: /\.(ttf|eot|woff|woff2|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name]__[hash:5].[ext]'
                    }
                }
            },
            // es 6+
            {
                test: /\.jsx?/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
}