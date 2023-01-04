#!/usr/bin/env node
import {
    SystemRouter,
} from "./Routers"
import {Server} from "socket.io"
import {createServer} from "http"
const app = (require("express"))();
const bodyParser = require("body-parser");

/*引入cors*/
const cors = require('cors');
app.use(cors());
const SocketClients = new Map()
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: true}) );//application/x-www-form-urlencoded
const httpServer = createServer( app )
const io = new Server(httpServer,{
    cors: {
        origin: "*",
    }
})
io.on( "connection",(socket)=>{
    SocketClients.set(socket,socket.id)
    console.log( `User Connected : ${SocketClients.size} online` )

    socket.on( "disconnect",function(data){
        SocketClients.delete( socket )
        console.log( `User Disconnected: ${SocketClients.size} online` )
    } )

    socket.on("send_message",function(data){
        io.sockets.emit("new_message",{msg: data})
        io.sockets.emit("test_message",{msg: "hello world!"})
    })
} )
httpServer.listen( 9527,()=>{
    console.log( "服务器已启动" )
} )

//处理错误
//发送请求
//const http = require("http");
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
app.use( "/api",SystemRouter )
//app.use("/consumer",ConsumerRouter);
//app.use("/publish",PublishRouter);

//捕获到异常不退出
process.on( "uncaughtException",(err)=>{
    console.log( err.stack )
    console.log( "NOT exit..." )
    //process.exit(0);
} )

process.setMaxListeners(0);