#!/usr/bin/env node
import Web3 from "web3";

const ExpressTimerDecorator = (
    target: any,
    key:any,
    descriptor:any
)=>{
    const original = descriptor.value;
    descriptor.value = async function(...args:any[]){
        console.log("======================================================START=====================================================================");
        console.log( `方法名称：${key}` )
        //console.log( `参数：${JSON.stringify(args[0].body)}` )
        const start = new Date().getTime();
        const result = await original( ...args );
        const end = new Date().getTime();
        // @ts-ignore
        console.log( `执行结果：${JSON.stringify(result)}` )
        console.log( `执行耗时：${end - start} ms` )
        console.log("======================================================END=======================================================================");
        return result;
    }
}

class Test{
    constructor(){

    }

    @ExpressTimerDecorator
    async show(){
        const sleep =(wait:number) =>  new Promise( (resolve,reject)=> setTimeout(resolve,wait) );
        await sleep(1000);
        console.log("sleep 1000")
        await sleep(3000)
        console.log("sleep 3000")
        return {
            code: 200,
            message: "SUCCESS",
            data: {}
        }
    }

    @ExpressTimerDecorator
    async showDp(){
        try{
            const arr = Array.from( {length: 10000},(_,i)=> i+1 )
            const dp = Array.from( {length:arr.length},()=>0)
            dp[0] =  arr[0]**2;
            for( let i = 1; i < arr.length; i++ ){
                dp[i] = dp[i-1] + arr[i] ** 2
            }
            return {
                code: 200,
                message: "SUCCESS",
                data: dp.slice(-11,-1)
            }
        }catch(err:any){
            return {
                code: 400,
                message: err.message,
                data: {}
            }
        }finally{
            console.log( "动态规划" )
        }
    }

    @ExpressTimerDecorator
    async showTrance(){
        try{
            const arr = Array.from( {length:11},(_,i)=>i+1 )
            const param:any[]= [];
            function tranceBack(data:number[],current:number[],pre:number){
                if( current.length === 5 ){
                    param.push( [...current] )
                    return
                }else{
                    for( let i = 0; i < data.length;i++ ){
                        //去重
                        if( i > 0 && data[i] === data[i-1] ){
                            continue;
                        }
                        if( i < pre ){
                            continue
                        }
                        current.push( data[i] )
                        const temp = data.filter( (v) => v != data[i] )
                        tranceBack( temp, current, i);
                        current.pop() 
                    }
                }
            }
            tranceBack(arr,[],0)
            return {
                code: 200,
                message: "SUCCESS",
                data: param.length
            }
        }catch(err:any){
            return {
                code: 400,
                message: err.message,
                data: {}
            }
        }finally{
            console.log( "回溯排列" )
        }
    }

    @ExpressTimerDecorator
    async showBacket(){
        try{
            const arr = Array.from( {length: 50000},(_,i)=>i+1 ).sort( (_)=>0.5 - Math.random() )
            console.log(arr)
            function heap(arr:number[],i:number,len:number){
                let left = 2*i + 1;
                let right = 2*i +2;
                let current = i;
                if( left < len && arr[left] > arr[current]){
                    current = left;
                }
                if( right < len && arr[right] > arr[current] ){
                    current = right;
                }
                if( current != i ){
                    [arr[i],arr[current]] = [arr[current],arr[i]]
                    heap( arr,current,len )
                }
            }
            for( let i = Math.floor( arr.length / 2); i >=0; i-- ){
                heap(arr,i,arr.length);
            }
            for( let i = arr.length -1; i>0; i-- ){
                [arr[0],arr[i]] = [arr[i],arr[0]]
                heap(arr,0,i)
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
            console.log("桶排序")
        }
    }

    @ExpressTimerDecorator
    async showProvider(){
        try{
            // @ts-ignore
            const web3Provider = new Web3( CHAIN_RPC )
            const contractStr = web3Provider.utils.encodePacked(
                web3Provider.eth.abi.encodeFunctionSignature({"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}),
                web3Provider.eth.abi.encodeParameters([{
                    type: "address",
                    name: "account"
                }],["0x143fb54163f08fe52ccadee059a6ea8cf7f8e925"])
            ) as string;
            const contractParam = await web3Provider.eth.call( {
                // @ts-ignore
                to: ITS_ADDRESS,
                data: contractStr
            } )
            const param = web3Provider.eth.abi.decodeParameters([
                {
                    name: "balance",
                    type: "uint256"
                }
            ],contractParam)
            return {
                code: 200,
                message: "SUCCESS",
                data: param
            }
        }catch(err:any){
            return {
                code: 400,
                message: err.message,
                data: {}
            }
        }finally{
            console.log( "Provider" )
        }
    }

}

( async()=>{
    const test = new Test();
    console.table(await test.showProvider())
} )()