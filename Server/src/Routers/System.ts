#!/usr/bin/env node
import {
    WithMysql,
    WithRabbitmq,
    ExpressTimerDecorator,
    Middleware,
} from "../Tools"
const router = require("express").Router();

interface ISystem{
    //获取列表
    getAllList(req:any,res:any):Promise<any>;
    //获取喜欢的列表
    getLikeList(req:any,res:any):Promise<any>;
}

class System implements ISystem{

    @ExpressTimerDecorator(1)
    async getAllList(req: any, res: any): Promise<any> {
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
            //查询
            const result = await new Promise( (resolve,reject)=>{
                const sql = `SELECT * FROM pornlulu WHERE 1`;
                conn.query( sql,[],(err:any,dataList:any[])=>err ? reject(err) : resolve(dataList)  )
            } )
            conn.commit();
            return {
                code: 200,
                message: "SUCCESS",
                data: result,
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
            console.log( "获取所有列表" )
        }
    }

    @ExpressTimerDecorator(0)
    async getLikeList(req: any, res: any): Promise<any> {
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
            //查询
            const result = await new Promise( (resolve,reject)=>{
                const sql = `SELECT * FROM pornlulu WHERE is_like = 1`;
                conn.query( sql,[],(err:any,dataList:any[])=>err ? reject(err) : resolve(dataList)  )
            } )
            conn.commit();
            return {
                code: 200,
                message: "SUCCESS",
                data: result,
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
            console.log( "获取Like列表" )
        }
    }

}

const middleware = new Middleware();
const consumer = new System();
//更新高度
router.get("/", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.getLikeList(req,res) );
router.get("/get_list", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.getAllList(req,res) );
export default router;


