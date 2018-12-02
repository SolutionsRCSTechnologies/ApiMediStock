import * as express from 'express'
import * as bodyParser from 'body-parser';

import { RoutingHandler } from '../CommonModule/RoutingHandler';
import { ServerConfig } from './ServerConfig';
import { Util } from '../CommonModule/UtilHandler';

class AppRouter{
    public exp:express.Express;
    constructor(){
        if(!this.exp){
            this.exp = express();
        }
        this.ConfigureApp();
    }
    ConfigureApp(){
        let allowedM:string|undefined = ServerConfig.AllowedMethods;
        let allowedH:string|undefined = ServerConfig.AllowedHeaders;
        let allowedO:string|undefined = ServerConfig.AllowedOrigins;
        this.exp.use((req, res, next)=>{
            res.header("Access-Control-Allow-Headers", allowedH);
            res.header("Access-Control-Allow-Methods",allowedM);
            res.header("Access-Control-Allow-Origin",allowedO);

            next();
        });

        this.exp.use(bodyParser.json());
        this.exp.use(bodyParser.urlencoded({ extended: true }));

        this.SetAppRouting(this.exp);
    }
    SetAppRouting(app:express.Express){
        app.use(bodyParser.json());
        if(app){
            let allRoutes = RoutingHandler;
            if(allRoutes && allRoutes.length>0){
                allRoutes.forEach(route=>{
                    if(route && route.url && route.handler && route.method){
                        let method = !route.method ? "": route.method.toString().trim().toUpperCase();
                        switch(method){
                            case "0":
                                app.get(route.url, (req, res)=>{
                                    let reqData = req.params;
                                    route.handler(reqData).then((obj)=>{
                                        Util.SendResponse(res, obj);
                                        res.end();
                                    })
                                    .catch(err=>{
                                        Util.SendErrorResponse(res, err);
                                        res.end();
                                    })
                                });
                            break;
                            case "1":
                                app.post(route.url, (req, res)=>{
                                    console.dir(req.body);
                                    //console.dir(JSON.parse(req));
                                    let reqData = req.body;
                                    console.log(reqData);
                                    //let reqObj = JSON.parse(reqData);
                                    route.handler(reqData).then((obj)=>{
                                        //console.log(res);
                                        console.log('obj');
                                        console.log(obj);
                                        console.log('obj2');
                                        Util.SendResponse(res, obj);
                                        res.end();
                                    })
                                    .catch(err=>{
                                        Util.SendErrorResponse(res, err);
                                        res.end();
                                    })
                                });
                            break;
                        }
                    }
                });
            }
        }
        return app;
    }
}

export let Router = new AppRouter();
export let App = new AppRouter().exp;