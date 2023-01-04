#!/usr/bin/env node
const mysql = require("mysql");

class WithMysql{

    private static Instance:any;

    static getInstance(){
        if( !WithMysql.Instance ){
            WithMysql.Instance = mysql.createPool( {
                // @ts-ignore
                host: MYSQL_HOST,
                // @ts-ignore
                user: MYSQL_USER,
                // @ts-ignore
                port: MYSQL_PORT as unknown as number,
                // @ts-ignore
                password: MYSQL_PASSWORD,
                // @ts-ignore
                database: MYSQL_DATABASE,
                // @ts-ignore
                charset: MYSQL_CHARSET,
                multipleStatements: true,
            } )
        }
        return  WithMysql.Instance;
    }
    
}


export default WithMysql;
/*
( async()=>{
    const withMysql = new WithMysql();
    const conn = await withMysql.connectHandle() as any;
    try{
        //开启事务
        await new Promise( (resolve,reject)=>{
            conn.beginTransaction( (err:any) => err ? reject(err) : resolve("开启事务成功") )
        } );
        //查询数据
        const data = await new Promise( (resolve,reject)=>{
            const querySql = `select * from sp_test`
            conn.query( querySql,[],(err:any,current_data:any)=> err ? reject(err) : resolve(current_data) )
        } );
        //写入数据
        await new Promise( (resolve,reject)=>{
            const insertSql = `INSERT INTO sp_test(id, name, sex, age) VALUES (?,?,?,?)`;
            const insertData = [0,"小明","男生",24];
            conn.query( insertSql,insertData,(err:any,currentData:any)=> err ? reject(err) : resolve(currentData) )
        } )
        //提交事务
        conn.commit();
        console.log( data );
    }catch(err:any){
        //回滚
        conn.rollback()
        console.log( err )
    }finally{
        //释放连接
        conn.release();
        console.log("测试数据库")
        process.exit(0)
    }
} )()
*/