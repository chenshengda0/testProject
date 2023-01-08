#!/usr/bin/env node
import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";

class WithHD{

    constructor(PrivateKey:string){
        try{
            const re = new RegExp("^(0x)?[0-9a-f]{64}$","i");
            if( !re.test( PrivateKey ) ){
                throw new Error("参数错误，导入私钥失败");
            }
            const provider = new HDWalletProvider(
                [PrivateKey],
                // @ts-ignore
                CHAIN_RPC,
            );
            return new Web3( provider );
        }catch(err:any){
            throw err;
        }finally{
            console.log("创建HD对象")
        }

    }

}

export default WithHD;