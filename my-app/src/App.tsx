import {Component} from "react"
import {io} from "socket.io-client"
import Cookies from 'js-cookie'
import {nanoid} from 'nanoid';

const AppParentComponent = (SonComponent:any)=>{
    class PackageComponent extends Component<any>{

        async UNSAFE_componentWillMount(){
            /*
            {
                withCredentials: true,
            }
            */
            if( !Cookies.get( "userid" ) ) {
                Cookies.set("userid",nanoid(),{path:"/"})
            }
            const socket = io("http://localhost:27149",{
                withCredentials: true,
            })
            window.socket = socket;
            console.log(socket)
            window.socket.on( "new_message",(data:any)=>{
                console.log(data)
            } )
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
