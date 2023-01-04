import {Component} from "react"
import {io} from "socket.io-client"

const AppParentComponent = (SonComponent:any)=>{
    class PackageComponent extends Component<any>{

        async UNSAFE_componentWillMount(){
            const socket = io("http://127.0.0.1:9527")
            window.socket = socket;
            console.log(socket)
            window.socket.emit("send_message",`客户aaa已登陆`)
            window.socket.on( "new_message",(data:any)=>{
                console.log(data)
            } )
            window.socket.on("test_message",(data:any)=>{
                console.log(data)
            })
        }

        render(){
            return (
                <>
                    <h1>Hello</h1>
                    <SonComponent></SonComponent>
                </>

            )
        }
    }

    return PackageComponent;
}

class App extends Component<any>{

    render(){
        return (
            <>App</>
        )
    }

}

export default AppParentComponent(App);
