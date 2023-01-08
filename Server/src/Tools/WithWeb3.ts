#!/usr/bin/env node
import Web3 from "web3";

class WithWeb3{

    private static Instance:WithWeb3;

    private constructor(){
    }

    static getInstance(){
        if( !WithWeb3.Instance ){
            // @ts-ignore
            WithWeb3.Instance = new Web3( CHAIN_RPC );
        }
        return WithWeb3.Instance;
    }

}

export default WithWeb3;