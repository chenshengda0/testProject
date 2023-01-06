#!/usr/bin/env node
import {
    WithMysql,
    WithRabbitmq,
    ExpressTimerDecorator,
    Middleware,
    WithSocketRedis,
} from "../Tools"
import * as puppeteer from "puppeteer"
const router = require("express").Router();

interface ISystem{
    //设置爬虫获取今日百度搜索热词
    getCralwer(req:any,res:any):Promise<any>;
    setCralwer(req:any,res:any):Promise<any>;
    //获取最短路径
    goodPath(req:any,res:any):Promise<any>;
    //获取cte递归深度
    getRecursiveDepth(req:any,res:any):Promise<any>;
}

class System implements ISystem{

    @ExpressTimerDecorator(0)
    async getRecursiveDepth(req:any,res:any){
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
            const dataList = await new Promise( (resolve,reject)=>{
                const sql = `
                    SET SESSION cte_max_recursion_depth = 1000;
                    WITH RECURSIVE cte(id) AS (
                        SELECT 1
                        UNION ALL
                        SELECT id + 1 FROM cte WHERE id < 1000
                    ) SELECT * FROM cte ORDER BY id DESC LIMIT 10
                `
                conn.query( sql,[],(err:any,dataList:any[])=> err ? reject(err) : resolve(dataList) )
            } )
            conn.commit();
            return {
                code: 200,
                message: "SUCCESS",
                data: dataList
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
            console.log("获取递归深度")
        }
    }

    @ExpressTimerDecorator(0)
    async goodPath(req:any,res:any){
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
            const dataList = await new Promise( (resolve,reject)=>{
                const sql = `
                    WITH RECURSIVE cte AS (
                        SELECT 
                            from_address,
                            to_address,
                            distance,
                            CAST(CONCAT( from_address, " -> ",to_address ) AS CHAR(200) ) AS path
                        FROM good_path WHERE from_address = "A"

                        UNION ALL
                        
                        SELECT 
                            cte.from_address,
                            g.to_address,
                            cte.distance + g.distance,
                            CAST(CONCAT( cte.path," -> ", g.to_address ) AS CHAR(200) ) AS path
                        FROM cte INNER JOIN good_path as g ON cte.to_address = g.from_address
                    ) SELECT * FROM cte WHERE to_address = "E" ORDER BY distance ASC
                `
                conn.query( sql,[],(err:any,dataList:any[]) => err ? reject(err) : resolve(dataList) )
            } ) as any[];
            for( const row of dataList ){
                global.io.emit( "new_message",row )
            }
            conn.commit();
            return {
                code: 200,
                message: "SUCCESS",
                data: dataList
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
            console.log("计算最短路径")
        }
    }

    @ExpressTimerDecorator(0)
    async getCralwer(req:any,res:any){
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
            const dataList = await new Promise( (resolve,reject)=>{
                const sql = `SELECT * FROM baidu WHERE 1 ORDER BY create_date DESC,id ASC LIMIT 100`;
                conn.query( sql, [],( err:any,dataList:any[] )=> err ? reject(err) : resolve(dataList) )
            } ) as any[];
            conn.commit();
            return {
                code: 200,
                message: "SUCCESS",
                data: dataList
            }
        }catch(err){
            conn.rollback()
            return {
                code: 400,
                message: err,
                data: {}
            }
        }finally{
            conn.release()
            console.log("爬虫")
        }
    }

    @ExpressTimerDecorator(0)
    async setCralwer(req:any,res:any){
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
        //创建浏览器
        const browser = await puppeteer.launch({
            //slowMo:100,
            devtools: false
        })
        try{
            //开启事务
            await new Promise( (resolve,reject)=>{
                conn.beginTransaction( (err:any) => err ? reject(err.message): resolve( "开启事务成功" ) )
            } )
            const times = new Date();
            const year = times.getFullYear();
            const month = times.getMonth()+1 < 10 ? `0${times.getMonth()+1}` : times.getMonth()+1;
            const day = times.getDay() < 10 ? `0${times.getDay()}` : times.getDay();
            const date_str = `${year}-${month}-${day}`;
            const dataList = await new Promise( (resolve,reject)=>{
                const sql = `SELECT * FROM baidu WHERE create_date = ?`;
                conn.query( sql, [date_str],( err:any,dataList:any[] )=> err ? reject(err) : resolve(dataList) )
            } ) as any[];
            if( dataList.length > 0 ){
                conn.commit();
                return {
                    code: 200,
                    message: "SUCCESS",
                    data: {},
                }
            }
            //查询今日是否有数据
            const page = await browser.newPage();
            const url = `https://www.baidu.com/`
            await page.goto( url )
            const resultsSelector = 'a[class="title-content  c-link c-font-medium c-line-clamp1"]';
            await page.waitForSelector(resultsSelector);
            const new_url = await page.evaluate( (resultsSelector) => (document.querySelectorAll(resultsSelector)[0] as any).href,resultsSelector );
            await page.goto( new_url )
            const listSelector = 'div[class="toplist1-tr_4kE4D"]';
            await page.waitForSelector(listSelector);
            const list = await page.evaluate( (listSelector)=>([...document.querySelectorAll( listSelector )] as any[]).map( (dom)=>{
                const current_times = new Date();
                const current_year = current_times.getFullYear();
                const current_month = current_times.getMonth()+1 < 10 ? `0${current_times.getMonth()+1}` : current_times.getMonth()+1;
                const current_day = current_times.getDay() < 10 ? `0${current_times.getDay()}` : current_times.getDay();
                const current_date_str = `${current_year}-${current_month}-${current_day}`;
                const tag = 'a[class="c-font-medium c-color-t opr-toplist1-subtitle_3FULy"]';
                const childALink = dom.querySelectorAll( tag )[0];
                return {
                    create_time: parseInt( current_times.getTime()/1000 as unknown as string ),
                    create_date: current_date_str,
                    title: childALink.title,
                    href: childALink.href,
                }
            } ),listSelector )
            for( const row of list ){
                //写入数据
                await new Promise( (resolve,reject)=>{
                    const sql = `INSERT INTO baidu(id, title, href, create_time, create_date) VALUES (0,?,?,?,?)`;
                    conn.query( sql, [
                        row.title,
                        row.href,
                        row.create_time,
                        row.create_date
                    ] ,(err:any,dataList:any)=> err ? reject(err) : resolve(dataList))
                } )
            }
            const returnList = await new Promise( (resolve,reject)=>{
                const sql = `SELECT * FROM baidu WHERE create_date = ?`;
                conn.query( sql, [date_str],( err:any,dataList:any[] )=> err ? reject(err) : resolve(dataList) )
            } ) as any[];
            for( const row of returnList ){
                global.io.emit("new_message",row)
            }
            conn.commit();
            return {
                code: 200,
                message: "SUCCESS",
                data: {}
            }
        }catch(err:any){
            conn.rollback()
            return {
                code: 400,
                message: err,
                data: {}
            }
        }finally{
            await browser.close();
            conn.release()
            console.log("爬虫")
        }
    }

}

const middleware = new Middleware();
const consumer = new System();
//更新高度
router.get("/", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.setCralwer(req,res) );
router.get("/get_cralwer", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.getCralwer(req,res) );
router.get("/good_path", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.goodPath(req,res) );
router.get("/get_recursive", async(req:any,res:any,next:any)=> await middleware.checkAuth(req,res,next), async(req:any,res:any)=>await consumer.getRecursiveDepth(req,res) );
export default router;


