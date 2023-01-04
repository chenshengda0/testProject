#!/usr/bin/env redis
const {createClient} = require("redis")

class WithRedis{

    private static Instance:WithRedis;

    // @ts-ignore
    private redis_url:string = REDIS_URL;

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
                url: this.redis_url,
                password: "231510622abc"
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