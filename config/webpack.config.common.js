/**
 * @file 公共的webpack配置文件
 * @author zhangluyao01
 */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');

module.exports = {
    entry: paths.entry,
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            {
                test: /\.(css)$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(less)$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(vert|frag)$/,
                use: ['raw-loader']
            },
            {
                test: /\.(jpeg|jpg|png|gif)/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        path: paths.assets
                    }
                }]
            }
        ]
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            template: paths.template,
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
            preserveLinebreaks: true,
            removeAttributeQuotes: true
        })
    ]
};
