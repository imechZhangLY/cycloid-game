/**
 * @file webpack的配置入口
 * @author zhangluyao01
 */
const webpackMerge = require('webpack-merge');
const common = require('./config/webpack.config.common');

const envs = {
    development: 'dev',
    production: 'prod'
};

const env = envs[process.env.NODE_ENV || 'development'];
const envConfig = require(`./config/webpack.config.${env}`);
module.exports = webpackMerge(common, envConfig);
