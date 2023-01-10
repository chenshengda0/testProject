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
    //获取最短交易路径
    getGoodPair(req:any,res:any):Promise<any>;

    //获取铁路路线
    getMetro(req:any,res:any):Promise<any>;

}
class System implements ISystem{

    /*
            const param:any[] = []
            function backTrance(params:string[],temps:string[],currentIndex:number){
                if( temps.length == 2 ){
                    param.push( [...temps] )
                    return
                }
                for( let i = 0; i < params.length;i++ ){
                    if( i > 0 && params[i] == params[i-1] ) continue;
                    const temp = params.filter( (row) => row != params[i] );
                    if( i < currentIndex ) continue;
                    temps = [...temps,params[i]];
                    backTrance(temp,temps,i);
                    temps.pop()
                }
            }
            backTrance(codes,[],0);

            const line = Array.from( {length:11},(_,i) => i+1 )
            function backTrance( data:number[],temps:number[],currentIndex:number ){
                if( temps.length == 2 ){
                    lines.push( [...temps] )
                    return
                }
                for( let i = 0; i < data.length; i++ ){
                    if( i > 0 && data[i] == data[i-1] ) continue;
                    if( i < currentIndex ) continue;
                    const temp = data.filter( (row) => row != data[i] )
                    temps = [...temps,data[i]]
                    backTrance( temp,temps,i );
                    temps.pop()  
                }
            }
            backTrance( line,[],0 )
    */

    @ExpressTimerDecorator(0)
    async getMetro(req:any,res:any){
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
            const {
                from = "沙井",
                to = "车公庙",
            } = req.params;
            const paths = await new Promise( (resolve,reject) => {
                const sql = `SELECT * FROM sp_metro WHERE (from_address = ? AND to_address = ?) OR (from_address = ? AND to_address = ?)`;
                conn.query( sql, [
                    from,
                    to,
                    to,
                    from
                ],(err:any,dataList:any[])=> err ? reject(err) : resolve(dataList) )
            } ) as any[];
            const path = paths[0]["line_path"];
            console.log( path )
            const res = await new Promise( (resolve,reject)=>{
                const sql = `
                    WITH RECURSIVE cte(
                        line_number,
                        from_address,
                        to_address,
                        line_path,
                        address_path,
                        distance
                    ) AS (
                        SELECT
                            line_number,
                            from_address,
                            to_address,
                            CAST( CONCAT( line_number, " -> ", line_number )  AS CHAR(10000) ),
                            CAST( CONCAT( " ",from_address, " -> ", to_address  ) AS CHAR(10000) ),
                            distance
                        FROM sp_metros WHERE from_address = ?
                    
                        UNION ALL
                    
                        SELECT 
                            sp_metros.line_number,
                            cte.from_address,
                            sp_metros.to_address,
                            CAST( CONCAT( cte.line_path, " -> ", sp_metros.line_number) AS CHAR(10000) ),
                            CAST( CONCAT( cte.address_path, " -> ", sp_metros.to_address, " " ) AS CHAR(10000) ),
                            cte.distance + sp_metros.distance
                        FROM cte INNER JOIN sp_metros 
                        ON cte.to_address = sp_metros.from_address
                        WHERE INSTR( cte.address_path, CONCAT( " ",sp_metros.to_address," "  ) ) <= 0 AND  INSTR( ?, CONCAT("-",sp_metros.line_number,"-")  ) > 0
                    ) SELECT * FROM cte WHERE to_address = ? ORDER BY distance ASC
                `
                conn.query( sql, [from,path,to],(err:any,dataList:any[]) => err ? reject(err) : resolve(dataList) )
            } )
            conn.commit();
            return {
                code: 200,
                message: "SUCCESS",
                data: res
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
            console.log("获取最短路径")
        }
    }

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
        const rabb = new WithRabbitmq()
        const pool = WithMysql.getInstance();
        console.log( pool.config.connectionConfig.clientFlags )
        const startDate = new Date();
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
            const coin_path = [
                // @ts-ignore
                REACT_SERVER_BNB,
                // @ts-ignore
                REACT_SERVER_BUSD,
                // @ts-ignore
                REACT_SERVER_USDT,
            ]
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
                        FROM pair WHERE from_address = ? AND INSTR(?,pair.to_address) > 0

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
                        FROM cte INNER JOIN pair ON cte.to_address = pair.from_address WHERE INSTR(cte.path, pair.to_address) <= 0 AND INSTR(?,pair.to_address) > 0
                    ) SELECT * FROM cte WHERE to_address = ? ORDER BY distance ASC LIMIT 1
                `;
                conn.query( sql,[
                    from,
                    `-${coin_path.join("-")}-`,
                    `-${coin_path.join("-")}-`,
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
            const endDate = new Date();
            const returnData = {
                mainCoin: `-${coin_path.join("-")}-`,
                runStatr: startDate,
                runEnd: endDate,
                from_address,
                from_symbol,
                to_address,
                to_symbol,
                path,
                symbols,
                price: `$${num_price.at(-1)}`,
            }
            await rabb.sendSocket( returnData )
            //获取两个币种地址
            conn.commit();
            return {
                code: 200,
                message: "SUCCESS",
                data: returnData,
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
    async getWeb3BlockData(req:any,res:any){
        const rabb = new WithRabbitmq();
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
            }
            await rabb.sendSocket( returnData )
            
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
        const rabb = new WithRabbitmq();
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
            await rabb.sendSocket( dataList )
            
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
        const rabb = new WithRabbitmq();
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
            await rabb.sendSocket(returnList);
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
router.get("/get_good_pair/:search_address", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.getGoodPair(req,res) );
router.get("/get_metro/:from/:to", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.getMetro(req,res) );
export default router;


