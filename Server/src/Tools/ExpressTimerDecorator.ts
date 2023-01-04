import WithRedis from "./WithRedis"
const ExpressTimerDecorator = (times:number = 0)=>{
    return (
        target: any,
        key:any,
        descriptor:any
    )=>{
        const original = descriptor.value;
        descriptor.value = async function(...args:any[]){
            const withRedis = WithRedis.getInstance();
            const client = withRedis.connection();
            console.log("======================================================START=====================================================================");
            try{
                client.on('error', (err:any) => {
                    throw new Error(`Redis Client Error: ${err.message}`)
                });
                const start = new Date().getTime();
                await client.connect()
                //检查键是否存在
                if( !await client.get(key) || isNaN( parseInt(await client.get(key)) ) ){
                    await client.set(key,0);
                }
                console.log( `执行方法：${key}` )
                console.log( `当前执行次数为：第 ${parseInt(await client.get(key)) + 1} 次` )
                if( times > 0 && parseInt(await client.get(key)) >= times ){
                    throw new Error(`同时执行次数超过${times}次`)
                }
                await client.set(key, parseInt(await client.get(key)) + 1 );
                //执行
                const result = await original( ...args );
                await client.set(key, parseInt(await client.get(key)) - 1 );
                const end = new Date().getTime();
                //输出信息
                //console.table( result )
                console.log( `请求参数:${JSON.stringify(args[0].body)}` )
                console.log( `执行耗时：${end - start} ms` )
                return args[1].json( result )
            }catch(err:any){
                return args[1].json({
                    code: 400,
                    message: `ERROR: ${err.message}`,
                    data: {}
                })
            }finally{
                await client.disconnect();
                console.log("======================================================END=======================================================================");
            }
        }
    }
}

export default ExpressTimerDecorator;