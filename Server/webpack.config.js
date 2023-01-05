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
    entry:"./src/index.ts",
    //devtool: 'eval-cheap-module-source-map',
    devtool: 'nosources-source-map',
    // 指定打包文件输出的路径
    output: {
        path: path.resolve(__dirname,'../Install/build'),
        // 打包后的文件
        filename: 'consumer.js',
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
            
            //MYSQL_HOST: JSON.stringify("dex-mariadb"),
            MYSQL_HOST: JSON.stringify("dex-mysql"),
            MYSQL_USER: JSON.stringify("root"),//replicater
            MYSQL_PORT: JSON.stringify("3306"),
            MYSQL_PASSWORD: JSON.stringify("231510622abc"),
            MYSQL_DATABASE: JSON.stringify("crawler"),
            MYSQL_CHARSET: JSON.stringify("utf8mb4"),

            REDIS_URL: JSON.stringify("redis://dex-redis:6379/0"),
            REDIS_SOCKET_URL: JSON.stringify("redis://dex-redis:6379/1"),
            REDIS_AUTH: JSON.stringify("231510622abc"),
            REDIS_MAX_MESSAGES: JSON.stringify(40),
            
            //CHAIN_RPC: JSON.stringify("http://47.242.10.129:8545"),
            CHAIN_RPC: JSON.stringify("https://bsc.getblock.io/b9699848-09b9-48c4-a99e-4b24caf4d36c/mainnet/"),
            CHAIN_TITLE: JSON.stringify("BSC MAIN NETWORK"),
            CAHIN_ID: JSON.stringify(56),
            CHAIN_GAS_LIMIT: JSON.stringify(5000000),
            CHAIN_GAS_PRICE: JSON.stringify(50000000000),

            REACT_SERVER_DEBUG: JSON.stringify(true),

            REACT_SERVER_CAKE: JSON.stringify("0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"),
            REACT_SERVER_BNB: JSON.stringify("0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"),
            REACT_SERVER_BUSD: JSON.stringify("0xe9e7cea3dedca5984780bafc599bd69add087d56"),
            REACT_SERVER_USDT: JSON.stringify("0x55d398326f99059ff775485246999027b3197955"),
            REACT_SERVER_BBTC: JSON.stringify("0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c"),

            ITS_CONTRACT: JSON.stringify( `[{"inputs":[],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract IERC20","name":"_token","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"AwardLog","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract IERC20","name":"_token","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"BoomLog","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract IERC20","name":"_token","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"CardLog","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract IERC20","name":"_token","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"ManagerLog","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract IERC20","name":"_token","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"RankingLog","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_address","type":"address"},{"indexed":false,"internalType":"contract IERC20","name":"_token","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"RechargeLog","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"Fomo","outputs":[{"internalType":"contract IFomo","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"NFTPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PancakeFactoryAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_ManagerMap","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bool","name":"_isExists","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"__owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"awardRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"blockNumTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"contractDecimal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"deadAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fundRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLastBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPrice","outputs":[{"internalType":"uint256","name":"_price","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isBlacklist","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isExcludedFromFees","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"marketAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"cardAmount","type":"uint256"}],"name":"mintBatchNFT","outputs":[{"internalType":"bool","name":"res","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mintNFT","outputs":[{"internalType":"bool","name":"res","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"a","type":"address"},{"internalType":"bool","name":"b","type":"bool"}],"name":"setBlacklist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"b","type":"uint256"}],"name":"setBlockNumTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newLimit","type":"uint256"}],"name":"setBoomLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"a","type":"address"},{"internalType":"bool","name":"b","type":"bool"}],"name":"setExcludeFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IFomo","name":"newOwner","type":"address"}],"name":"setFomo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newMarket","type":"address"}],"name":"setMarketAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"setNFTPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"t","type":"uint256"}],"name":"setTrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tradingEnabledTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferFomoOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"__token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawCurrentToken","outputs":[],"stateMutability":"nonpayable","type":"function"}]` ),
            ITS_ADDRESS: JSON.stringify("0x5D35513BD0e6585145601ED32D204CDA1Df3b7f8"),

            ERC20_CONTRACT: JSON.stringify(`[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]`),
            
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