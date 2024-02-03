const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const HtmlPlugin= require('html-webpack-plugin')

module.exports = {
    mode: "development",
    devtool: 'cheap-module-source-map',
    entry: {
        popup: path.resolve('./src/popup/popup.tsx'),
    },
    module: {
        rules: [
            {
                use: "ts-loader",
                test: /\.tsx$/,
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.resolve('src/manifest.json'), to: path.resolve('dist') },
                { from: path.resolve('src/assets/icon.png'), to: path.resolve('dist') },
            ],
        }),
        new HtmlPlugin({
            title: "BroCal",
            filename: 'popup.html',
            chunks: ['popup']
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js'
    }
};
