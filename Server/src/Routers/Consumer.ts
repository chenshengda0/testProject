#!/usr/bin/env node
import {
    WithRabbitmq,
    ExpressTimerDecorator,
    Middleware,
    WithWeb3,
    WithMysql,
} from "../Tools"
const router = require("express").Router();

interface IConsumer{
    //发送消息，获取Pancake Factory V1 交易对
    getV1PairInfo(req:any,res:any):Promise<any>;
}

class Consumer implements IConsumer{


    @ExpressTimerDecorator(0)
    async getV1PairInfo(req:any,res:any){
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
        /*
            const rabb = new WithRabbitmq();
            const message = await rabb.consumer( "PancakePairsEvents" );
            if( !message || parseInt( message.pairsId ) < 0 ) return {
                code: 400,
                message: "未定义消息",
                data: {}
            }
        */
        try{
            const {
                key,
            } = req.params;
            // @ts-ignore
            const factory_contract = FACTORY_V1_ADDRESS;
            /*
                const {
                    pairsId : key, 
                    contract: factory_contract,
                } = message;
            */
            //开启事务
            await new Promise( (resolve,reject)=>{
                conn.beginTransaction( (err:any) => err ? reject(err.message): resolve( "开启事务成功" ) )
            } )
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
            //console.log( `获取交易对地址:${pair_token}` )
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
            //console.log( `获取token0地址:${token0_addr}` )
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
            //console.log( `获取token1地址:${token1_addr}` )
            //获取token0 symbol
            const encodePackedToken0Symbol = web3.utils.encodePacked(
                web3.eth.abi.encodeFunctionSignature( {"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"} )
            )
            const contractToken0Symbol = await web3.eth.call({
                to: token0_addr,
                data: encodePackedToken0Symbol
            }).catch( (err:any) => Promise.resolve("") )
            const token0_symbol = await new Promise( (resolve,reject)=>
                resolve( web3.eth.abi.decodeParameters([
                    {type:"string",name:"token0_symbol"}
                ],contractToken0Symbol).token0_symbol )
            ).catch( err=> Promise.resolve("") ) as unknown as string;
            //console.log( `获取token0 symbol:${token0_symbol}` )
            //获取Token0 decimals
            const encodePackedToken0Decimals = web3.utils.encodePacked(
                web3.eth.abi.encodeFunctionSignature( {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"} )
            );
            const contractTokenDecimals = await web3.eth.call({
                to: token0_addr,
                data: encodePackedToken0Decimals
            }).catch( (err:any) => Promise.resolve("") )
            const token0_decimal = await new Promise( (resolve,reject)=>
                resolve( web3.eth.abi.decodeParameters([
                    {type:"uint8",name:"token0_decimal"}
                ],contractTokenDecimals).token0_decimal )
            ).catch( err => Promise.resolve(-1) ) as unknown as number;
            //console.log( `获取Token0 decimals:${token0_decimal}` )
            //获取token1 symbol
            const encodePackedToken1Symbol = web3.utils.encodePacked(
                web3.eth.abi.encodeFunctionSignature( {"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"} )
            )
            const contractToken1Symbol = await web3.eth.call({
                to: token1_addr,
                data: encodePackedToken1Symbol
            }).catch( (err:any) => Promise.resolve("") )
            const token1_symbol = await new Promise( (resolve,reject)=> 
                resolve( web3.eth.abi.decodeParameters([
                    {type:"string",name:"token1_symbol"}
                ], contractToken1Symbol).token1_symbol )
            ).catch( err => Promise.resolve("") ) as unknown as string;
            //console.log( `获取token1 symbol: ${token1_symbol}` )
            //获取token1 Decimals
            const encodePackedToken1Decimals = web3.utils.encodePacked(
                web3.eth.abi.encodeFunctionSignature( {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"} )
            )
            const contractToken1Decimals = await web3.eth.call({
                to: token1_addr,
                data: encodePackedToken1Decimals
            }).catch( (err:any) => Promise.resolve("") )
            const token1_decimal = await new Promise( (resolve,reject)=>
                resolve( web3.eth.abi.decodeParameters([
                    {type:"uint8",name:"token1_decimal"}
                ],contractToken1Decimals).token1_decimal )
            ).catch( err => Promise.resolve(-1) ) as unknown as number;
            //console.log( `获取token1 Decimals: ${token1_decimal}` )
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
            //await rabb.publish( "PancakePairsEvents", message);
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


}

const middleware = new Middleware();
const consumer = new Consumer();
router.get("/:key", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.getV1PairInfo(req,res) );
export default router;




