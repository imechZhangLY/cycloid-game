/**
 * @file 开发环境的webpack配置
 * @author zhangluyao01
 */
const webpack = require('webpack');
const paths = require('./paths');

module.exports = {
    mode: 'development',
    output: {
        filename: 'main.js',
        path: paths.output
    },
    devServer: {
        contentBase: paths.output,
        compress: true,
        hot: true,
        historyApiFallback: true,
        proxy: {}
    },
    optimization: {}
};
