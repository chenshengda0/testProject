#!/usr/bin/env redis
const {createClient} = require("redis")

class WithRedis{

    private static Instance:WithRedis;

    private constructor(){

    }

    static getInstance(){
        if( !WithRedis.Instance ){
            WithRedis.Instance = new WithRedis();
        }
        return WithRedis.Instance;
    }

    connection(){
        try{
            const client = createClient({
                // @ts-ignore
                url: REDIS_URL,
                // @ts-ignore
                password: REDIS_AUTH
            })
            return client;
        }catch(err){
            return err;
        }finally{
            console.log("连接redis")
        }
    }

}

export default WithRedis;