#!/usr/bin/env node
import {
    WithMysql,
    WithRabbitmq,
    ExpressTimerDecorator,
    Middleware,
    WithSocketRedis,
    WithHD,
    WithWeb3,
} from "../Tools"
import * as puppeteer from "puppeteer"
import BigNumber from "bignumber.js";
const router = require("express").Router();

interface ISystem{
    //设置爬虫获取今日百度搜索热词
    getCralwer(req:any,res:any):Promise<any>;
    setCralwer(req:any,res:any):Promise<any>;
    //获取最短路径
    goodPath(req:any,res:any):Promise<any>;
    //获取cte递归深度
    getRecursiveDepth(req:any,res:any):Promise<any>;
    //获取区块信息
    getWeb3BlockData(req:any,res:any):Promise<any>;
    getHDBlockData(req:any,res:any):Promise<any>;
    //获取交易对信息
    getPairInfo(req:any,res:any):Promise<any>;
    //获取最短交易路径
    getGoodPair(req:any,res:any):Promise<any>;

}

class System implements ISystem{

    private static async getPairPrice(pair:string,from_address:string,to_address:string){
        try{
            const web3 = WithWeb3.getInstance() as any;
            const pairStr = pair.toLowerCase(); 
            //获取两个币种地址
            const token0AddrData = await web3.eth.call({
                to: pairStr,
                data: web3.eth.abi.encodeFunctionCall(JSON.parse("{\"constant\":true,\"inputs\":[],\"name\":\"token0\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"}"),[])
            })
            const token0Addr = web3.eth.abi.decodeParameters([{
                type: "address",
                name: "token0Addr"
            }],token0AddrData).token0Addr as unknown as string;
            const pairReservesData = await web3.eth.call({
                to: pairStr,
                data: web3.eth.abi.encodeFunctionCall(JSON.parse("{\"constant\":true,\"inputs\":[],\"name\":\"getReserves\",\"outputs\":[{\"internalType\":\"uint112\",\"name\":\"_reserve0\",\"type\":\"uint112\"},{\"internalType\":\"uint112\",\"name\":\"_reserve1\",\"type\":\"uint112\"},{\"internalType\":\"uint32\",\"name\":\"_blockTimestampLast\",\"type\":\"uint32\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"}"),[])
            })
            const pairReserves = web3.eth.abi.decodeParameters([
                {type:"uint112",name:"_reserve0"},
                {type:"uint112",name:"_reserve1"},
                {type:"uint32",name:"_blockTimestampLast"},
            ], pairReservesData);
            if( token0Addr.toLowerCase() == from_address.toLowerCase() ){
                return new BigNumber(pairReserves._reserve1 as unknown as number).dividedBy( new BigNumber( pairReserves._reserve0 as unknown as number ) ).toFixed();
            }else if( token0Addr.toLowerCase() == to_address.toLowerCase() ){
                return new BigNumber(pairReserves._reserve0 as unknown as number).dividedBy( new BigNumber( pairReserves._reserve1 as unknown as number ) ).toFixed()
            }else{
                throw new Error("参数错误");
            }
        }catch(err){
            throw err;
        }finally{
            console.log(`获取实时价格`)
        }
    }

    @ExpressTimerDecorator(0)
    async getGoodPair(req:any,res:any){
        const pool = WithMysql.getInstance();
        console.log( pool.config.connectionConfig.clientFlags )
        const conn =  await new Promise( (resolve,reject)=> pool.getConnection( (err:any,connection:any)=> err ? resolve(0) : resolve(connection) ) ) as any;
        if( !conn ){
            return {
                code: 400,
                message: "获取 POOL池 连接失败",
                data: {},
            }
        }
        try{
            const {
                search_address = "0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd",
            } = req.params;
            //开启事务
            await new Promise( (resolve,reject)=>{
                conn.beginTransaction( (err:any) => err ? reject(err.message): resolve( "开启事务成功" ) )
            } )
            const from = search_address.toLowerCase();
            const to = "0x55d398326f99059ff775485246999027b3197955";
            const dataList = await new Promise( (resolve,reject)=>{
                const sql = `
                    WITH RECURSIVE cte( from_address,from_symbol,to_address,to_symbol,path,symbols,pairs,distance ) AS (
                        SELECT 
                            from_address,
                            from_symbol,
                            to_address,
                            to_symbol,
                            CAST( CONCAT( from_address, " -> ", to_address) AS CHAR(10000) ),
                            CAST( CONCAT( from_symbol, " -> " ,to_symbol ) AS CHAR(3000) ),
                            CAST( CONCAT( pair ) AS CHAR(10000) ),
                            1
                        FROM pair WHERE from_address = ?

                        UNION ALL

                        SELECT
                        cte.from_address,
                        cte.from_symbol,
                        pair.to_address,
                        pair.to_symbol,
                        CAST( CONCAT( cte.path, " -> ", pair.to_address ) AS CHAR(10000) ),
                        CAST( CONCAT( cte.symbols, " -> ", pair.to_symbol ) AS CHAR(3000) ),
                        CAST( CONCAT( cte.pairs, " -> ", pair.pair) AS CHAR(10000) ),
                        cte.distance + 1
                        FROM cte INNER JOIN pair ON cte.to_address = pair.from_address WHERE INSTR(cte.path, pair.to_address) <= 0 AND cte.to_address IN (?,?,?,?,?) 
                    ) SELECT * FROM cte WHERE to_address = ? ORDER BY distance ASC LIMIT 1
                `;
                conn.query( sql,[
                    from,
                    // @ts-ignore
                    REACT_SERVER_BNB,
                    // @ts-ignore
                    REACT_SERVER_BUSD,
                    // @ts-ignore
                    REACT_SERVER_CAKE,
                    // @ts-ignore
                    REACT_SERVER_BBTC,
                    // @ts-ignore
                    REACT_SERVER_USDT,
                    to
                ],(err:any,dataList:any[])=> err ? reject(err) : resolve(dataList) )
            } ) as any[]
            if( dataList.length <= 0 ){
                throw new Error("未查询到交易对")
            }
            //计算价格
            const {
                from_address,
                from_symbol,
                to_address,
                to_symbol,
                path,
                symbols,
                pairs,
                distance,
            } = dataList[0];
            const re = /\s+[^0-9a-fx]+\s+/;
            const total_pair = pairs.split( re );
            const total_path = path.split( re );
            const total_price = [];
            for( const index in total_pair ){
                const price = await System.getPairPrice(total_pair[index],total_path[index],total_path[parseInt(index) +1]);
                total_price.push( price );
            }
            const num_price = Array.from( {length: total_price.length },()=> "" )
            num_price[0] = total_price[0];
            for( let i = 1; i < num_price.length; i++ ){
                num_price[i] = new BigNumber(new BigNumber( num_price[i-1] ).multipliedBy( new BigNumber(total_price[i]) ).multipliedBy( new BigNumber( Math.pow(10,18) ) ).integerValue()).dividedBy( new BigNumber( Math.pow(10,18) ) ).toFixed(); 
            }
            //获取两个币种地址
            conn.commit();
            return {
                code: 200,
                message: "SUCCESS",
                data: {
                    from_address,
                    from_symbol,
                    to_address,
                    to_symbol,
                    path,
                    symbols,
                    price: `$${num_price.at(-1)}`,
                },
            }
        }catch(err:any){
            conn.rollback()
            return {
                code: 400,
                message: err.message,
                data: {}
            }
        }finally{
            conn.release();
            console.log("获取两个币种最短交易路径")
        }
    }

    @ExpressTimerDecorator(0)
    async getPairInfo(req:any,res:any){
        const pool = WithMysql.getInstance();
        console.log( pool.config.connectionConfig.clientFlags )
        const conn =  await new Promise( (resolve,reject)=> pool.getConnection( (err:any,connection:any)=> err ? resolve(0) : resolve(connection) ) ) as any;
        if( !conn ){
            return {
                code: 400,
                message: "获取 POOL池 连接失败",
                data: {},
            }
        }
        try{
            const {
                key = 0,
            } = req.params;
            //开启事务
            await new Promise( (resolve,reject)=>{
                conn.beginTransaction( (err:any) => err ? reject(err.message): resolve( "开启事务成功" ) )
            } )
            // @ts-ignore
            const factory_contract = FACTORY_V1_ADDRESS;
            //验证是否有两条数据
            const useList = await new Promise( (resolve,reject)=>{
                const sql = `SELECT * FROM pair WHERE factory = LOWER(?) AND list_key = ?`;
                conn.query( sql,[factory_contract,key],(err:any,dataList:any[])=> err ? reject(err) : resolve(dataList) )
            } ) as any[];
            if( useList.length === 2 ){
                conn.commit();
                return {
                    code: 200,
                    message: "SUCCESS",
                    data: {}
                }
            }
            if( useList.length < 2 ){
                //删除数据
                await new Promise( (resolve,reject)=>{
                    const sql = `DELETE FROM pair WHERE factory = LOWER(?) AND list_key = ?`;
                    conn.query( sql,[factory_contract,key],(err:any,dataList:any) => err ? reject(err) : resolve(dataList)  )
                } )
            }
            const web3 = WithWeb3.getInstance() as any;
            //获取交易对地址
            const encodePackedPairs = await web3.utils.encodePacked(
                web3.eth.abi.encodeFunctionSignature( {"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"} ),
                web3.eth.abi.encodeParameters([
                    {
                        type: "uint256",
                        name: "PairIndex"
                    }
                ],[ key ])
            )
            const contractPairs = await web3.eth.call({
                to: factory_contract,
                data: encodePackedPairs,
            })
            const pair_token = await new Promise( (resolve,reject)=>
                resolve( web3.eth.abi.decodeParameters([
                    {type:"address",name:"pair_token"}
                ],contractPairs).pair_token)
            ).catch( err => Promise.resolve( "" ) )  as unknown as string;
            //获取token0地址
            const encodePackedToken0 = web3.utils.encodePacked(
                web3.eth.abi.encodeFunctionSignature( {"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"} ),
            )
            const contractToken0 = await web3.eth.call({
                to: pair_token,
                data: encodePackedToken0
            })
            const token0_addr = await new Promise( (resolve,reject)=> 
                resolve( web3.eth.abi.decodeParameters([
                    {type:"address",name:"token0_addr"}
                ],contractToken0).token0_addr )
            ).catch( err => Promise.resolve("") ) as unknown as string;

            //获取token1地址
            const encodePackedToken1 = web3.utils.encodePacked(
                web3.eth.abi.encodeFunctionSignature( {"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"} )
            )
            const contractToken1 = await web3.eth.call({
                to: pair_token,
                data: encodePackedToken1
            })
            const token1_addr = await new Promise( (resolve,reject)=>
                resolve( web3.eth.abi.decodeParameters([
                    {type:"address",name:"token1_addr"}
                ],contractToken1).token1_addr )
            ).catch( err => Promise.resolve("") ) as unknown as string;
            //获取token0 symbol
            const encodePackedToken0Symbol = web3.utils.encodePacked(
                web3.eth.abi.encodeFunctionSignature( {"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"} )
            )
            const contractToken0Symbol = await web3.eth.call({
                to: token0_addr,
                data: encodePackedToken0Symbol
            })
            const token0_symbol = await new Promise( (resolve,reject)=>
                resolve( web3.eth.abi.decodeParameters([
                    {type:"string",name:"token0_symbol"}
                ],contractToken0Symbol).token0_symbol )
            ).catch( err=> Promise.resolve("") ) as unknown as string;

            //获取Token0 decimals
            const encodePackedToken0Decimals = web3.utils.encodePacked(
                web3.eth.abi.encodeFunctionSignature( {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"} )
            );
            const contractTokenDecimals = await web3.eth.call({
                to: token0_addr,
                data: encodePackedToken0Decimals
            });
            const token0_decimal = await new Promise( (resolve,reject)=>
                resolve( web3.eth.abi.decodeParameters([
                    {type:"uint8",name:"token0_decimal"}
                ],contractTokenDecimals).token0_decimal )
            ).catch( err => Promise.resolve(-1) ) as unknown as number;
            //获取token1 symbol
            const encodePackedToken1Symbol = web3.utils.encodePacked(
                web3.eth.abi.encodeFunctionSignature( {"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"} )
            )
            const contractToken1Symbol = await web3.eth.call({
                to: token1_addr,
                data: encodePackedToken1Symbol
            })
            const token1_symbol = await new Promise( (resolve,reject)=> 
                resolve( web3.eth.abi.decodeParameters([
                    {type:"string",name:"token1_symbol"}
                ], contractToken1Symbol).token1_symbol )
            ).catch( err => Promise.resolve("") ) as unknown as string;

            //获取token1 Decimals
            const encodePackedToken1Decimals = web3.utils.encodePacked(
                web3.eth.abi.encodeFunctionSignature( {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"} )
            )
            const contractToken1Decimals = await web3.eth.call({
                to: token1_addr,
                data: encodePackedToken1Decimals
            })
            const token1_decimal = await new Promise( (resolve,reject)=>
                resolve( web3.eth.abi.decodeParameters([
                    {type:"uint8",name:"token1_decimal"}
                ],contractToken1Decimals).token1_decimal )
            ).catch( err => Promise.resolve(-1) ) as unknown as number;
            //写入数据库
            await new Promise( (resolve,reject)=>{
                const sql = `INSERT INTO pair(id, list_key, factory, is_reverse, pair, from_address, from_symbol, from_decimal, to_address, to_symbol, to_decimal) VALUES (0,?,LOWER(?),0,LOWER(?),LOWER(?),?,?,LOWER(?),?,?)`;
                conn.query( sql, [
                    key,
                    factory_contract,
                    pair_token,
                    token0_addr,
                    token0_symbol,
                    token0_decimal,
                    token1_addr,
                    token1_symbol,
                    token1_decimal,
                ],(err:any,dataList:any) => err ? reject(err) : resolve(dataList) )
            } )
            await new Promise( (resolve,reject)=>{
                const sql = `INSERT INTO pair(id, list_key, factory, is_reverse, pair, from_address, from_symbol, from_decimal, to_address, to_symbol, to_decimal) VALUES (0,?,LOWER(?),1,LOWER(?),LOWER(?),?,?,LOWER(?),?,?)`;
                conn.query( sql, [
                    key,
                    factory_contract,
                    pair_token,
                    token1_addr,
                    token1_symbol,
                    token1_decimal,
                    token0_addr,
                    token0_symbol,
                    token0_decimal,
                ],(err:any,dataList:any) => err ? reject(err) : resolve(dataList) )
            } )
            conn.commit();
            return {
                code: 200,
                message: "SUCCESS",
                data: {}
            }
        }catch(err:any){
            conn.rollback()
            return {
                code: 400,
                message: err.message,
                data: {}
            }
        }finally{
            conn.release()
            console.log("获取交易对信息")
        }
    }

    @ExpressTimerDecorator(0)
    async getWeb3BlockData(req:any,res:any){
        try{
            const web3 = WithWeb3.getInstance() as any;
            const SwapEvent = await web3.utils.sha3("Swap(address,uint256,uint256,uint256,uint256,address)");
            //获取当前区块时间
            const timestamp =(await web3.eth.getBlock("latest")).timestamp
            const logRes = await web3.eth.getPastLogs({
                fromBlock: "latest",
                topics: [
                    SwapEvent,
                ]
            }) as any[];
            const returnData = [];
            for( const log of logRes ){
                const amountObj = web3.eth.abi.decodeParameters([
                    {type:"uint256",name:"amount0In"},
                    {type:"uint256",name:"amount1In"},
                    {type:"uint256",name:"amount0Out"},
                    {type:"uint256",name:"amount1Out"},
                ],log.data);
                const emitObj = {
                    blockNumber: log.blockNumber,
                    blockTime: timestamp,
                    transactionHash: log.transactionHash,
                    logIndex: log.logIndex,
                    pair: log.address,
                    event: log.topics[0],
                    sender: web3.eth.abi.decodeParameters( [
                        {
                            name: "sender",
                            type: "address"
                        }
                    ],log.topics[1] ).sender as string,
                    spender: web3.eth.abi.decodeParameters( [
                        {
                            name: "spender",
                            type: "address"
                        }
                    ],log.topics[2] ).spender as string,
                    amount0In: amountObj.amount0In,
                    amount0Out: amountObj.amount0Out,
                    amount1In: amountObj.amount1In,
                    amount1Out: amountObj.amount1Out,
                };
                returnData.push( emitObj )
                global.io.emit("new_message",emitObj)
            }
            return {
                code: 200,
                message: "SUCCESS",
                data: returnData,
            }
        }catch(err:any){
            return {
                code: 400,
                message: err.message,
                data: {}
            }
        }finally{
            console.log("获取区块数据")
        }
    }

    @ExpressTimerDecorator(0)
    async getHDBlockData(req:any,res:any){
        try{
            const web3 = new WithHD("188ca0c70e02bdf7b52c211c6b3e3a29b4bd1ea54906d188f78e0545236916a1") as any;
            const latestBlock = await web3.eth.getBlockNumber()
            const SwapEvent = await web3.utils.sha3("Swap(address,uint256,uint256,uint256,uint256,address)");
            const logRes = await web3.eth.getPastLogs({
                fromBlock: latestBlock - 5,
                toBlock: latestBlock,
                topics: [
                    SwapEvent,
                ]
            }) as any[];
            return {
                code: 200,
                message: "SUCCESS",
                data: logRes,
            }
        }catch(err:any){
            return {
                code: 400,
                message: err.message,
                data: {}
            }
        }finally{
            console.log("获取区块数据")
        }
    }

    @ExpressTimerDecorator(0)
    async getRecursiveDepth(req:any,res:any){
        const pool = WithMysql.getInstance();
        console.log( pool.config.connectionConfig.clientFlags )
        const conn =  await new Promise( (resolve,reject)=> pool.getConnection( (err:any,connection:any)=> err ? resolve(0) : resolve(connection) ) ) as any;
        if( !conn ){
            return {
                code: 400,
                message: "获取 POOL池 连接失败",
                data: {},
            }
        }
        try{
            //开启事务
            await new Promise( (resolve,reject)=>{
                conn.beginTransaction( (err:any) => err ? reject(err.message): resolve( "开启事务成功" ) )
            } )
            const dataList = await new Promise( (resolve,reject)=>{
                const sql = `
                    WITH RECURSIVE cte(current,prev,current_pow,total) AS (
                        SELECT 1,0,1,1
                        UNION ALL
                        SELECT 
                            current + 1,
                            cte.total,
                            POW(current + 1,2),
                            POW(current + 1,2) + cte.total 
                        FROM cte WHERE current < 100
                    ) SELECT * FROM cte ORDER BY current DESC
                `
                conn.query( sql,[],(err:any,dataList:any[])=> err ? reject(err) : resolve(dataList) )
            } )
            conn.commit();
            return {
                code: 200,
                message: "SUCCESS",
                data: dataList
            }
        }catch(err:any){
            conn.rollback()
            return {
                code: 400,
                message: err.message,
                data: {}
            }
        }finally{
            conn.release()
            console.log("获取递归深度")
        }
    }

    @ExpressTimerDecorator(0)
    async goodPath(req:any,res:any){
        const pool = WithMysql.getInstance();
        console.log( pool.config.connectionConfig.clientFlags )
        const conn =  await new Promise( (resolve,reject)=> pool.getConnection( (err:any,connection:any)=> err ? resolve(0) : resolve(connection) ) ) as any;
        if( !conn ){
            return {
                code: 400,
                message: "获取 POOL池 连接失败",
                data: {},
            }
        }
        try{
            //开启事务
            await new Promise( (resolve,reject)=>{
                conn.beginTransaction( (err:any) => err ? reject(err.message): resolve( "开启事务成功" ) )
            } )
            const dataList = await new Promise( (resolve,reject)=>{
                const sql = `
                    WITH RECURSIVE cte AS (
                        SELECT 
                            from_address,
                            to_address,
                            distance,
                            CAST(CONCAT( from_address, " -> ",to_address ) AS CHAR(200) ) AS path
                        FROM good_path WHERE from_address = "A"

                        UNION ALL
                        
                        SELECT 
                            cte.from_address,
                            g.to_address,
                            cte.distance + g.distance,
                            CAST(CONCAT( cte.path," -> ", g.to_address ) AS CHAR(200) ) AS path
                        FROM cte INNER JOIN good_path as g ON cte.to_address = g.from_address WHERE INSTR(cte.path,g.to_address) <= 0
                    ) SELECT * FROM cte WHERE to_address = "E" ORDER BY distance ASC
                `
                conn.query( sql,[],(err:any,dataList:any[]) => err ? reject(err) : resolve(dataList) )
            } ) as any[];
            for( const row of dataList ){
                global.io.emit( "new_message",row )
            }
            conn.commit();
            return {
                code: 200,
                message: "SUCCESS",
                data: dataList
            }
        }catch(err:any){
            conn.rollback()
            return {
                code: 400,
                message: err.message,
                data: {}
            }
        }finally{
            conn.release()
            console.log("计算最短路径")
        }
    }

    @ExpressTimerDecorator(0)
    async getCralwer(req:any,res:any){
        const pool = WithMysql.getInstance();
        console.log( pool.config.connectionConfig.clientFlags )
        const conn =  await new Promise( (resolve,reject)=> pool.getConnection( (err:any,connection:any)=> err ? resolve(0) : resolve(connection) ) ) as any;
        if( !conn ){
            return {
                code: 400,
                message: "获取 POOL池 连接失败",
                data: {},
            }
        }
        try{
            //开启事务
            await new Promise( (resolve,reject)=>{
                conn.beginTransaction( (err:any) => err ? reject(err.message): resolve( "开启事务成功" ) )
            } )
            const dataList = await new Promise( (resolve,reject)=>{
                const sql = `SELECT * FROM baidu WHERE 1 ORDER BY create_date DESC,id ASC LIMIT 100`;
                conn.query( sql, [],( err:any,dataList:any[] )=> err ? reject(err) : resolve(dataList) )
            } ) as any[];
            conn.commit();
            return {
                code: 200,
                message: "SUCCESS",
                data: dataList
            }
        }catch(err){
            conn.rollback()
            return {
                code: 400,
                message: err,
                data: {}
            }
        }finally{
            conn.release()
            console.log("爬虫")
        }
    }

    @ExpressTimerDecorator(0)
    async setCralwer(req:any,res:any){
        const pool = WithMysql.getInstance();
        console.log( pool.config.connectionConfig.clientFlags )
        const conn =  await new Promise( (resolve,reject)=> pool.getConnection( (err:any,connection:any)=> err ? resolve(0) : resolve(connection) ) ) as any;
        if( !conn ){
            return {
                code: 400,
                message: "获取 POOL池 连接失败",
                data: {},
            }
        }
        //创建浏览器
        const browser = await puppeteer.launch({
            //slowMo:100,
            devtools: false
        })
        try{
            //开启事务
            await new Promise( (resolve,reject)=>{
                conn.beginTransaction( (err:any) => err ? reject(err.message): resolve( "开启事务成功" ) )
            } )
            const times = new Date();
            const year = times.getFullYear();
            const month = times.getMonth()+1 < 10 ? `0${times.getMonth()+1}` : times.getMonth()+1;
            const day = times.getDay() < 10 ? `0${times.getDay()}` : times.getDay();
            const date_str = `${year}-${month}-${day}`;
            const dataList = await new Promise( (resolve,reject)=>{
                const sql = `SELECT * FROM baidu WHERE create_date = ?`;
                conn.query( sql, [date_str],( err:any,dataList:any[] )=> err ? reject(err) : resolve(dataList) )
            } ) as any[];
            if( dataList.length > 0 ){
                conn.commit();
                return {
                    code: 200,
                    message: "SUCCESS",
                    data: {},
                }
            }
            //查询今日是否有数据
            const page = await browser.newPage();
            const url = `https://www.baidu.com/`
            await page.goto( url )
            const resultsSelector = 'a[class="title-content  c-link c-font-medium c-line-clamp1"]';
            await page.waitForSelector(resultsSelector);
            const new_url = await page.evaluate( (resultsSelector) => (document.querySelectorAll(resultsSelector)[0] as any).href,resultsSelector );
            await page.goto( new_url )
            const listSelector = 'div[class="toplist1-tr_4kE4D"]';
            await page.waitForSelector(listSelector);
            const list = await page.evaluate( (listSelector)=>([...document.querySelectorAll( listSelector )] as any[]).map( (dom)=>{
                const current_times = new Date();
                const current_year = current_times.getFullYear();
                const current_month = current_times.getMonth()+1 < 10 ? `0${current_times.getMonth()+1}` : current_times.getMonth()+1;
                const current_day = current_times.getDay() < 10 ? `0${current_times.getDay()}` : current_times.getDay();
                const current_date_str = `${current_year}-${current_month}-${current_day}`;
                const tag = 'a[class="c-font-medium c-color-t opr-toplist1-subtitle_3FULy"]';
                const childALink = dom.querySelectorAll( tag )[0];
                return {
                    create_time: parseInt( current_times.getTime()/1000 as unknown as string ),
                    create_date: current_date_str,
                    title: childALink.title,
                    href: childALink.href,
                }
            } ),listSelector )
            for( const row of list ){
                //写入数据
                await new Promise( (resolve,reject)=>{
                    const sql = `INSERT INTO baidu(id, title, href, create_time, create_date) VALUES (0,?,?,?,?)`;
                    conn.query( sql, [
                        row.title,
                        row.href,
                        row.create_time,
                        row.create_date
                    ] ,(err:any,dataList:any)=> err ? reject(err) : resolve(dataList))
                } )
            }
            const returnList = await new Promise( (resolve,reject)=>{
                const sql = `SELECT * FROM baidu WHERE create_date = ?`;
                conn.query( sql, [date_str],( err:any,dataList:any[] )=> err ? reject(err) : resolve(dataList) )
            } ) as any[];
            for( const row of returnList ){
                global.io.emit("new_message",row)
            }
            conn.commit();
            return {
                code: 200,
                message: "SUCCESS",
                data: {}
            }
        }catch(err:any){
            conn.rollback()
            return {
                code: 400,
                message: err,
                data: {}
            }
        }finally{
            await browser.close();
            conn.release()
            console.log("爬虫")
        }
    }

}

const middleware = new Middleware();
const consumer = new System();
//更新高度
router.get("/", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.setCralwer(req,res) );
router.get("/get_cralwer", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.getCralwer(req,res) );
router.get("/good_path", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.goodPath(req,res) );
router.get("/get_recursive", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.getRecursiveDepth(req,res) );
router.get("/get_web3_block", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.getWeb3BlockData(req,res) );
router.get("/get_hd_block", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.getHDBlockData(req,res) );
router.get("/get_pair_info/:key", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.getPairInfo(req,res) );
router.get("/get_good_pair/:search_address", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.getGoodPair(req,res) );
export default router;


