#!/usr/bin/env node

class Middleware{
    constructor(){}

    async checkAuth(req:any,res:any,next:any){
        try{
            req["body"]['currentTime'] = new Date();
            next();
        }catch(err:any){
            return res.json({
                code: 300,
                message: err.message,
                data: []
            })
        }finally{
            //验证账号是否过期
            console.log( `验证账号是否在有效期` )
        }
    }

}

export default Middleware;
