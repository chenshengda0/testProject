#!/usr/bin/env node

const ExpressTimerDecorator = (
    target: any,
    key:any,
    descriptor:any
)=>{
    const original = descriptor.value;
    descriptor.value = async function(...args:any[]){
        console.log("======================================================START=====================================================================");
        console.log( `方法名称：${key}` )
        //console.log( `参数：${JSON.stringify(args[0].body)}` )
        const start = new Date().getTime();
        const result = await original( ...args );
        const end = new Date().getTime();
        // @ts-ignore
        console.log( `执行结果：${JSON.stringify(result)}` )
        console.log( `执行耗时：${end - start} ms` )
        console.log("======================================================END=======================================================================");
        return result;
    }
}

class Test{

    private clsName:string;

    constructor(){
        this.clsName = "Test"
    }

    @ExpressTimerDecorator
    async huisu(){
        try{
            const arr = Array.from({length:11},(_,i)=>i+1)
            const param:number[][]=[];
            function tranceBack(arr:number[],data:number[],prev:number){
                if( data.length == 5 ){
                    param.push( [...data] )
                    return ;
                }else{
                    for( let i = 0; i< arr.length; i++ ){
                        if( i > 0 && arr[i] === arr[i-1] ) continue;
                        if( i < prev ) continue;
                        const temp:number[] = arr.filter( (_,index)=> index !== i )
                        data = [...data,arr[i]]
                        tranceBack( temp,data,i )
                        data.pop()
                    }
                }
            }
            tranceBack(arr,[],0)
            return param
        }catch(err:any){
            return {}
        }finally{
            console.log("回溯算法")
        }
    }

    @ExpressTimerDecorator
    async pailie(){
        try{
            //const arr = Array.from( {length: 5},()=>Math.random() )
            const arr = [1,2,1,3].sort()
            const param:number[][] = [];
            console.log(arr)
            function tranceBack(arr:number[],data:number[]){
                if( data.length === 4 ){
                    param.push([...data])
                    return ;
                }else{
                    for( let i = 0; i<arr.length; i++ ){
                        if( i >0 && arr[i] === arr[i-1] ) continue;
                        const temp:number[] = arr.filter( (_,index) => index !== i );
                        data = [...data,arr[i]]
                        tranceBack(temp,data);
                        data.pop();
                    }
                }
            }
            tranceBack(arr,[])
            return param;
        }catch(err){
            return err
        }finally{
            console.log("排列")
        }
    }

    @ExpressTimerDecorator
    async showDp(zeroAxis:number,oneAxis:number){
        try{
            const dp = Array.from( {length:zeroAxis},()=>Array.from( {length:oneAxis},()=>0 ) )
            for( let i = 0; i < oneAxis; i++ ){
                dp[0][i] = 1;
            }
            for( let i = 0;i < zeroAxis;i++ ){
                dp[i][0] = 1;
            }
            for( let i = 1;i < zeroAxis;i++ ){
                for( let j = 1;j < oneAxis;j++ ){
                    if( i == 1 && j == 1 ){
                        dp[i][j] = 0;
                    }else{
                        dp[i][j] = dp[i][j-1] + dp[i-1][j]
                    }
                }
            }
            return dp;
        }catch(err){
            return err;
        }finally{
            console.log( "动态规划,有障碍物" )
        }
    }

    @ExpressTimerDecorator
    async showDps(zeroAxis:number){
        try{
            const arr = Array.from( {length:zeroAxis}, ()=>0 )
            arr[1] = 1;
            for( let i = 2; i < zeroAxis; i++ ){
                arr[i] = arr[i-1] + arr[i-2];
            }
            const dp = Array.from( {length:zeroAxis},()=>0 )
            dp[0] = 0;
            for( let i = 1;i<zeroAxis;i++ ){
                dp[i] = dp[i-1] + arr[i]
            }
            console.log( arr )
            return dp;
        }catch(err){
            return err
        }finally{
            console.log("斐波那契数")
        }
    }

    @ExpressTimerDecorator
    async heapShow(){
        try{
            const arr = Array.from( {length: 30000},(_,i)=>Math.random() )
            let runTimes = 0;
            let changeTimes = 0;
            function _heap(arr:number[],index:number,count:number){
                runTimes++;
                let left = 2 * index + 1;
                let right = 2 * index + 2;
                let top = index;
                if( left < count && arr[left] > arr[top] ){
                    top = left;
                }
                if( right < count && arr[right] > arr[top] ){
                    top = right;
                }
                if( top != index ){
                    changeTimes++;
                    [ arr[top],arr[index] ] = [ arr[index], arr[top] ];
                    _heap( arr,top,count );
                }
            }
            //建立大顶堆
            for( let i = Math.floor(arr.length/2); i>=0; i-- ){
                _heap( arr,i,arr.length )
            }
            for( let i = arr.length - 1; i > 0; i-- ){
                [ arr[0],arr[i] ] = [ arr[i],arr[0] ];
                _heap( arr,0,i );
            }
            console.log( runTimes )
            console.log( changeTimes )
            return arr.slice(-10);
        }catch(err){
            return err;
        }finally{
            console.log("堆排序")
        }
    }

    @ExpressTimerDecorator
    async dpShow(){
        try{
            const ap = Array.from( {length:9},()=>0 )
            ap[0] = 1;
            ap[3]=4;
            ap[5]=6;
            ap[8]=9;
            function backTrace(arr:number[]){
                for( let i = 0; i<arr.length; i++ ){
                    if( arr[i] == 0 ){
                        for( let k = 1; k < 10;k++ ){
                            console.log(i,k)
                            if( isValid(arr,k) ){
                                arr[i] = k;
                                if( backTrace(arr) ) return true;
                                arr[i] = 0;
                            }
                        }
                        return false;
                    }
                }
                return true;
            }

            function isValid(temp:number[],val:number){
                return !temp.includes( val );
            }
            backTrace(ap)
            return ap;
        }catch(err){
            return err;
        }finally{
            console.log( "爬楼梯" )
        }
    }

    @ExpressTimerDecorator
    async showGame(){
        try{
            const arr = Array.from( {length:9},()=>Array.from({length:9},()=>0) )
            function randomInt(min:number,max:number){
                return Math.floor(Math.random()*(max-min+1))+min
            }
            function getLen( arr:number[][] ){
                let num = 0;
                for( let i = 0;i < 9;i++ ){
                    for( let j=0;j<9;j++ ){
                        if( arr[i][j] > 0  ) num++;
                    }
                }
                return num;
            }
            while( getLen(arr) < 19 ){
                let i = randomInt(0,8);
                let j = randomInt(0,8);
                let k = randomInt(1,9);
                if( arr[i][j] == 0 && isValid(arr,i,j,k) ) arr[i][j] = k;
            }
            console.log("初始化")
            console.table( arr );
            function backTrace(arr:number[][]){
                for( let i = 0; i < 9; i++ ){
                    for( let j=0; j < 9; j++ ){
                        if( arr[i][j] === 0 ){
                            for( let k = 1;k < 10;k++ ){
                                if( isValid(arr,i,j,k) ){
                                    arr[i][j] = k;
                                    if( backTrace(arr) ) return true;
                                    arr[i][j] = 0;
                                }
                            }
                            return false;
                        }
                    }
                }
                return true;
            }
            function isValid( arr:number[][],i:number,j:number,k:number ){
                if( arr[i].includes( k ) ) return false;
                //纵向检查
                for( let axis = 0; axis < 9;axis++ ){
                    if( arr[axis][j] == k) return false;
                }
                //九宫格检查
                const zeroAxis = Math.floor( i / 3 ) * 3;
                const oneAxis = Math.floor( j / 3 ) * 3;
                for( let zeroIndex = zeroAxis; zeroIndex < zeroAxis + 3;zeroIndex++ ){
                    for( let oneIndex = oneAxis;oneIndex < oneAxis + 3;oneIndex++ ){
                        if( arr[zeroIndex][oneIndex] == k ) return false;
                    }
                }
                return true;
            }
            backTrace(arr)
            return arr;
        }catch(err){
            return err;
        }finally{
            console.log("数独")
        }
    }

}

(async()=>{
    const test = new Test();
    //console.table( await test.huisu() )
    //console.table( await test.pailie() )
    //console.table( await test.showDp(3,7) )
    //console.table( await test.showDps(50) )
    //console.table( await test.heapShow() )
    //console.table( await test.dpShow() )
    console.table( await test.showGame() )
})()