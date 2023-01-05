#!/usr/bin/env redis
const {createClient} = require("redis")

class WithSocketRedis{

    private static Instance:WithSocketRedis;

    private constructor(){

    }

    static getInstance(){
        if( !WithSocketRedis.Instance ){
            WithSocketRedis.Instance = new WithSocketRedis();
        }
        return WithSocketRedis.Instance;
    }

    connection(){
        try{
            const client = createClient({
                // @ts-ignore
                url: REDIS_SOCKET_URL,
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

export default WithSocketRedis;