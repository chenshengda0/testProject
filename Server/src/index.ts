#!/usr/bin/env node
import {
    SystemRouter,
} from "./Routers"
import {Server} from "socket.io"
import {createServer} from "http"
import {WithSocketRedis} from "./Tools"
const app = (require("express"))();
const bodyParser = require("body-parser");
const cookie = require("cookie");

/*引入cors*/
//const cors = require('cors');
//app.use(cors());
/*
app.use((req:any, res:any, next:any) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method' )
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE')
    res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE')
    next();
});
*/
global.SocketClients = new Map()
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: true}) );//application/x-www-form-urlencoded
app.get('/', (req:any, res:any) => {
    return res.json({
        code: 200,
        message: "home page",
        data: {}
    })
})
app.use( "/api",SystemRouter )
//app.use("/consumer",ConsumerRouter);
//app.use("/publish",PublishRouter);
const httpServer = createServer( app )
global.io = new Server(httpServer,{
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
})

global.io.use(function (socket:any, next:any) {
    if( socket.request.headers.cookie ){
        console.log("中间件")
        console.log( cookie.parse(socket.request.headers.cookie).userid )
        console.log( `socketId: ${socket.id}` )
        next();
    }else{
        return next( new Error("Missing cookie headers") )
    }
});

global.io.on( "connection",function(socket:any){
    socket.on( "disconnect",async function(){
        const withRedis = WithSocketRedis.getInstance();
        const client = withRedis.connection();
        try{
            client.on('error', (err:any) => {
                throw new Error(`Redis Client Error: ${err.message}`)
            });
            await client.connect()
            await client.HDEL("socket_clients",socket.id );
            console.log( `disconnect:当前在线账户有${await client.HLEN("socket_clients")}人` )
        }catch(err){
            console.log( err )
        }finally{
            await client.disconnect();
        }
    } )

    socket.on("send_message",function(data:any){
        global.io.sockets.emit("new_message",data)
    })

    socket.conn.on("upgrade",async()=>{
        const withRedis = WithSocketRedis.getInstance();
        const client = withRedis.connection();
        try{
            client.on('error', (err:any) => {
                throw new Error(`Redis Client Error: ${err.message}`)
            });
            await client.connect()
            await client.DEL("socket_clients")
            const param = Array.from( socket.nsp.sockets );
            const paramArr = [];
            for( const row in param ){
                paramArr.push( (param[row] as any[])[0] );
                paramArr.push( cookie.parse((param[row] as any[])[1].handshake.headers.cookie).userid )
            }
            await client.HSET("socket_clients",paramArr )
            console.log( `当前在线账户有${await client.HLEN("socket_clients")}人` )
        }catch(err){
            console.log( err )
        }finally{
            await client.disconnect();
        }
    })
} )


httpServer.listen( 9527,()=>{
    console.log( "服务器已启动" )
} )

//处理错误
//发送请求
//const http = require("http");
/*
const request = require("request");
//服务端TCP已断开，客户端还在请求，服务端keepalive断开时间为5秒
const Agent = require("agentkeepalive");
const agent = new Agent();
setInterval(() => {
    const reqInfo = request.get("http://127.0.0.1:9527", {agent}, (err:any) => {
      if (!err) {
        console.log("success");
      } else if (err.code === 'ECONNRESET' && reqInfo.req.reusedSocket) {
        // 如果错误码为ECONNRESET，且复用了TCP连接，那么重试一次
        return request.get("http://127.0.0.1:9527", (err:any) => {
          if (err) {
            throw err;
          } else {
            //process.exit();
            console.log("success with retry");
          }
        });
      } else {
        throw err;
      }
    });
}, 5000);
*/

//捕获到异常不退出
process.on( "uncaughtException",(err)=>{
    console.log( err.stack )
    console.log( "NOT exit..." )
    //process.exit(0);
} )

process.setMaxListeners(0);