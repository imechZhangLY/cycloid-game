/**
 * @file 定义一些常见的路径
 * @author zhangluyao01
 */
const path = require('path');

module.exports = {
    root: path.join(__dirname, '../'),
    output: path.join(__dirname, '../output'),
    entry: path.join(__dirname, '../src/index.tsx'),
    template: path.join(__dirname, '../src/index.html'),
    js: 'js',
    assets: 'assets'
};
