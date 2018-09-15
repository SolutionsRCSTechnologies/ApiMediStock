const ServerConfigurationParams = {
    HostName:"",
    Port: 3001,
    Domain:"",
    AllowedMethods: "GET,POST",
    AllowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
    AllowedOrigins: "*"
};

class ServerConfiguration{
    public get Port(){
        return ServerConfigurationParams.Port;
    }

    public get Host(){
        return ServerConfigurationParams.HostName;
    }

    public get Domain(){
        return ServerConfigurationParams.Domain;
    }

    public get AllowedMethods(){
        return ServerConfigurationParams.AllowedMethods;
    }

    public get AllowedHeaders(){
        return ServerConfigurationParams.AllowedHeaders;
    }

    public get AllowedOrigins(){
        return ServerConfigurationParams.AllowedOrigins;
    }
}

export let ServerConfig = new ServerConfiguration();