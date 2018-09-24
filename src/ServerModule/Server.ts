import { App } from './Router';
import { ServerConfig } from './ServerConfig';

class AppServer{

    StartServer(){
        let port = ServerConfig.Port;
        let host = ServerConfig.Host;
        let domain = ServerConfig.Domain;
        App.listen(port, ()=> {
            console.log("Server is listening at port "+ port);
        });
    }
}

export let Server = new AppServer();