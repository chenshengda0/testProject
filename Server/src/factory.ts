#!/usr/bin/bash
interface Car{
    name: string;
    run():any;
}

class BMW implements Car{

    public name:string;

    constructor(){
        this.name = "宝马";
    }

    run() {
        return `${this.name} 时速40KM/H`;
    }
}

class ABM implements Car{

    public name:string;

    constructor(){
        this.name = "奔驰"
    }

    run() {
        return `${this.name} 时速50KM/H`;
    }
}

class Factory{
    static create(types:string){
        switch(types){
            case "A":
                return new ABM();
            default:
                return new BMW();
        }
    }
}

const obj = Factory.create("A")
console.log( obj.run() )
const obj1 = Factory.create("B")
console.log( obj1.run() )
