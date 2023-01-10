const path  = require('path')
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
//const HtmlWebpackPlugin = require('html-webpack-plugin')
// webpack中所有配置信息都应该写在module.exports中
module.exports = {
    stats: {
        // Configure the console output
        errorDetails: false, //this does show errors
        colors: false,
        modules: true,
        reasons: true
    },
    target: "node",
    mode: "production",
    // 入口文件
    entry:"./index.ts",
    //devtool: 'eval-cheap-module-source-map',
    devtool: 'nosources-source-map',
    // 指定打包文件输出的路径
    output: {
        path: path.resolve(__dirname,'../Install/build'),
        // 打包后的文件
        filename: 'ws.js',
    },
    plugins: [
        //全局变量
        new webpack.DefinePlugin({
            RABBITMQ_PROTOCOL: JSON.stringify("amqp"),
            RABBITMQ_HOSTNAME: JSON.stringify("dex-haproxy"),
            RABBITMQ_PORT: JSON.stringify(5670),
            RABBITMQ_USERNAME: JSON.stringify("dream"),
            RABBITMQ_PASSWORD: JSON.stringify("231510622abc"),
            RABBITMQ_LOCALE: JSON.stringify("en_US"),
            RABBITMQ_FRAMEMAX: JSON.stringify(0),
            RABBITMQ_HOST: JSON.stringify("/"),
        }),
        //报错
        new webpack.IgnorePlugin({
            resourceRegExp: /^electron$/
        }),
        /*
            new HtmlWebpackPlugin({
                template: './public/index.html',
            }),
        */
    ],
    // 指定webpack打包时使用的模块
    module:{
        // 指定要加载的规则
        rules:[
            {
                // 指定的是规则生效的文件
                test: /\.ts$/,
                // 要使用的loader
                use: "ts-loader",
                // 要排除的文件
                exclude: [/node_modules/gi,/my-app/gi],
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.ts'],
    },
    optimization: {
        minimize: false,
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    },
    performance : {
        hints : false
    }
}