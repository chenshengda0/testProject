#!/usr/bin/env node
import {Server} from "socket.io"
import {createServer} from "http"
const app = (require("express"))();


const httpServer = createServer( app )
const io = new Server(httpServer,{
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
})

const QueueMap = new Map();


io.on( "connection",async function(socket:any){
    const exchange_name = "amq.fanout";
    const queue_name = socket.id;
    const amqp = await require("amqplib/callback_api");
    //连接器
    const connection = await new Promise( (resolve,reject)=>amqp.connect({
        // @ts-ignore
        protocol: RABBITMQ_PROTOCOL,
        // @ts-ignore
        hostname: RABBITMQ_HOSTNAME,
        // @ts-ignore
        port: RABBITMQ_PORT,
        // @ts-ignore
        username: RABBITMQ_USERNAME,
        // @ts-ignore
        password: RABBITMQ_PASSWORD,
        // @ts-ignore
        locale: RABBITMQ_LOCALE,
        // @ts-ignore
        frameMax: RABBITMQ_FRAMEMAX,
        //heartbeat: number,
        // @ts-ignore
        host: RABBITMQ_HOST,
    },(err:any,connection:any)=> err ? reject(err) : resolve(connection) ) ) as any;
    //创建通道
    const channel = await new Promise( (resolve,reject)=>connection.createChannel( (err:any,channel:any)=> err ? reject(err) : resolve(channel) ) ) as any;
    //创建队列
    await channel.assertQueue(queue_name,{
        durable: false,      //持久化
        autoDelete: true,  //自动删除
        exclusive: false,   //排它
    })
    console.log( `${queue_name}已连接` )
    //绑定队列
    await channel.bindQueue( queue_name,exchange_name );
    channel.consume(queue_name, (message:any) => {
        const data = JSON.parse( message.content.toString() )
        io.to(queue_name).emit('new_message', data)
    }, { noAck: true })
    QueueMap.set( queue_name, connection )

    socket.on( "disconnect",function(){
        QueueMap.get(socket.id).close()
        QueueMap.delete(socket.id)
    } )
} )


httpServer.listen( 27149,()=>{
    console.log( "服务器已启动" )
} )

//捕获到异常不退出
process.on( "uncaughtException",(err)=>{
    console.log( err.stack )
    console.log( "NOT exit..." )
    //process.exit(0);
} )

process.setMaxListeners(0);