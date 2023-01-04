#!/usr/bin/env node
class Danli{
    private static Instance:Danli;

    public count:number = 0;

    private constructor(){

    }

    static getInstance(){
        if( !Danli.Instance ){
            Danli.Instance = new Danli();
        }
        return Danli.Instance
    }

    getMethod(){
        this.count++;
    }
}

const a = Danli.getInstance();
const b = Danli.getInstance();
const c = Danli.getInstance();

a.getMethod()
console.log( a.count )
b.getMethod()
console.log( b.count )
c.getMethod()
console.log( c.count )

