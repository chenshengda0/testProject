#!/usr/bin/env node
import {
    WithRabbitmq,
    ExpressTimerDecorator,
    Middleware,
    WithWeb3,
} from "../Tools"
const router = require("express").Router();

interface IPublish{
    //发送消息，获取Pancake Factory V1 交易对
    getV1PairInfo(req:any,res:any):Promise<any>;
}

class Publish implements IPublish{


    @ExpressTimerDecorator(0)
    async getV1PairInfo(req:any,res:any){
        try{
            const web3 = WithWeb3.getInstance() as any;
            // @ts-ignore
            const address = FACTORY_V1_ADDRESS;
            //获取交易对地址
            const encodePackedPairs = await web3.utils.encodePacked(
                web3.eth.abi.encodeFunctionSignature( {"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"} ),
            )
            const contractPairs = await web3.eth.call({
                to: address,
                data: encodePackedPairs,
            })
            const pair_length = await new Promise( (resolve,reject)=>
                resolve( web3.eth.abi.decodeParameters([
                    {type:"uint256",name:"pair_length"}
                ],contractPairs).pair_length)
            ).catch( err => Promise.resolve( "" ) )  as unknown as number;
            const arr = Array.from( {length:pair_length },(_,i) => i );
            for( const row of arr ){
                
            }
            return {
                code: 200,
                message: "SUCCESS",
                data: arr
            }
        }catch(err:any){
            return {
                code: 400,
                message: err.message,
                data: {}
            }
        }finally{
            console.log( "发送消息，获取交易对" )
        }
    }


}

const middleware = new Middleware();
const consumer = new Publish();
router.get("/", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.getV1PairInfo(req,res) );
export default router;




