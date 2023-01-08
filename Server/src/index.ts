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
/*
-- 1号线
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','机场东','宝安中心',6);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','宝安中心','机场东',6);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','宝安中心','前海湾',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','前海湾','宝安中心',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','前海湾','世界之窗',7);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','世界之窗','前海湾',7);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','世界之窗','车公庙',4);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','车公庙','世界之窗',4);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','车公庙','购物公园',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','购物公园','车公庙',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','购物公园','会展中心',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','会展中心','购物公园',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','会展中心','岗厦',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','岗厦','会展中心',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','岗厦','科学馆',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','科学馆','岗厦',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','科学馆','大剧院',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','大剧院','科学馆',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','大剧院','老街',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','老街','大剧院',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','老街','罗湖',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'1','罗湖','老街',2);

-- 2号线
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','赤湾','后海',8);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','后海','赤湾',8);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','后海','世界之窗',3);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','世界之窗','后海',3);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','世界之窗','安托山',3);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','安托山','世界之窗',3);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','安托山','景田',4);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','景田','安托山',4);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','景田','福田',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','福田','景田',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','福田','市民中心',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','市民中心','福田',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','市民中心','华强北',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','华强北','市民中心',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','华强北','大剧院',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','大剧院','华强北',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','大剧院','黄贝岭',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','黄贝岭','大剧院',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','黄贝岭','梧桐山南',5);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'2','梧桐山南','黄贝岭',5);

-- 3号线
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','福保','石厦',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','石厦','福保',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','石厦','购物公园',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','购物公园','石厦',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','购物公园','福田',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','福田','购物公园',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','福田','少年宫',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','少年宫','福田',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','少年宫','莲花村',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','莲花村','少年宫',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','莲花村','华新',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','华新','莲花村',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','华新','通新岭',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','通新岭','华新',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','通新岭','红岭',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','红岭','通新岭',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','红岭','老街',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','老街','红岭',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','老街','田贝',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','田贝','老街',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','田贝','布吉',3);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','布吉','田贝',3);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','布吉','双龙',14);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'3','双龙','布吉',14);

-- 4号线
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'4','福田口岸','福民',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'4','福民','福田口岸',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'4','福民','会展中心',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'4','会展中心','福民',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'4','会展中心','市民中心',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'4','市民中心','会展中心',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'4','市民中心','少年宫',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'4','少年宫','市民中心',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'4','少年宫','上梅林',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'4','上梅林','少年宫',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'4','上梅林','深圳北站',3);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'4','深圳北站','上梅林',3);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'4','深圳北站','红山',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'4','红山','深圳北站',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'4','红山','牛湖',12);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'4','牛湖','红山',12);


-- 5号线
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','赤湾','前湾',5);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','前湾','赤湾',5);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','前湾','前海湾',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','前海湾','前湾',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','前海湾','宝安中心',3);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','宝安中心','前海湾',3);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','宝安中心','西丽',6);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','西丽','宝安中心',6);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','西丽','深圳北站',4);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','深圳北站','西丽',4);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','深圳北站','五和',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','五和','深圳北站',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','五和','布吉',6);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','布吉','五和',6);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','布吉','太安',3);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','太安','布吉',3);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','太安','黄贝岭',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'5','黄贝岭','太安',2);

-- 6号线
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'6','松岗','红山',18);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'6','红山','松岗',18);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'6','红山','深圳北站',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'6','深圳北站','红山',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'6','深圳北站','银湖',3);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'6','银湖','深圳北站',3);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'6','银湖','八卦岭',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'6','八卦岭','银湖',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'6','八卦岭','通新岭',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'6','通新岭','八卦岭',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'6','通新岭','科学馆',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'6','科学馆','通新岭',1);

-- 7号线
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','西丽湖','西丽',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','西丽','西丽湖',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','西丽','安托山',6);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','安托山','西丽',6);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','安托山','车公庙',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','车公庙','安托山',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','车公庙','石厦',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','石厦','车公庙',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','石厦','福民',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','福民','石厦',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','福民','华强北',4);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','华强北','福民',4);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','华强北','华新',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','华新','华强北',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','华新','八卦岭',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','八卦岭','华新',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','八卦岭','红岭北',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','红岭北','八卦岭',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','红岭北','田贝',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','田贝','红岭北',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','田贝','太安',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'7','太安','田贝',1);


-- 8号线
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'8','梧桐山南','盐田路',5);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'8','盐田路','梧桐山南',5);

-- 9号线
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','前湾','红树湾南',10);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','红树湾南','前湾',10);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','红树湾南','车公庙',4);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','车公庙','红树湾南',4);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','车公庙','景田',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','景田','车公庙',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','景田','上梅林',4);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','上梅林','景田',4);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','上梅林','孖岭',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','孖岭','上梅林',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','孖岭','银湖',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','银湖','孖岭',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','银湖','红岭北',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','红岭北','银湖',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','红岭北','红岭',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','红岭','红岭北',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','红岭','文锦',5);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'9','文锦','红岭',5);


-- 10号线
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'10','福田口岸','福民',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'10','福民','福田口岸',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'10','福民','岗厦',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'10','岗厦','福民',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'10','岗厦','莲花村',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'10','莲花村','岗厦',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'10','莲花村','孖岭',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'10','孖岭','莲花村',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'10','孖岭','五和',4);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'10','五和','孖岭',4);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'10','五和','双拥街',13);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'10','双拥街','五和',13);

-- 11号线
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'11','碧头','松岗',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'11','松岗','碧头',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'11','松岗','前海湾',11);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'11','前海湾','松岗',11);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'11','前海湾','后海',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'11','后海','前海湾',2);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'11','后海','红树湾南',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'11','红树湾南','后海',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'11','红树湾南','车公庙',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'11','车公庙','红树湾南',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'11','车公庙','福田',1);
INSERT INTO `sp_metros`(`id`, `line_number`, `from_address`, `to_address`, `distance`) VALUES (0,'11','福田','车公庙',1);




WITH RECURSIVE cte(
    line_number,
	from_address,
    to_address,
    line_path,
    address_path,
    distance
) AS (
	SELECT
        line_number,
        from_address,
        to_address,
        CAST( CONCAT( line_number, " -> ", line_number )  AS CHAR(10000) ),
        CAST( CONCAT( from_address, " -> ", to_address  ) AS CHAR(10000) ),
        distance
    FROM sp_metros WHERE from_address = "松岗"

    UNION ALL

    SELECT 
        sp_metros.line_number,
        cte.from_address,
        sp_metros.to_address,
        CAST( CONCAT( cte.line_path, " -> ", sp_metros.line_number) AS CHAR(10000) ),
        CAST( CONCAT( cte.address_path, " -> ", sp_metros.to_address ) AS CHAR(10000) ),
        cte.distance + sp_metros.distance
    FROM cte INNER JOIN sp_metros 
    ON cte.to_address = sp_metros.from_address
    WHERE INSTR( cte.address_path, CONCAT( " ",sp_metros.to_address," "  ) ) <= 0 AND cte.line_number in (1,2,8,11)
) SELECT * FROM cte WHERE to_address = "深外高中" ORDER BY distance ASC limit 3

*/