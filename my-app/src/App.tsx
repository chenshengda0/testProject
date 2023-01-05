import {Component} from "react"
import {io} from "socket.io-client"
import Cookies from 'js-cookie'

const AppParentComponent = (SonComponent:any)=>{
    class PackageComponent extends Component<any>{

        async UNSAFE_componentWillMount(){
            /*
            {
                withCredentials: true,
            }
            */
            const socket = io("http://localhost:9527")
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
