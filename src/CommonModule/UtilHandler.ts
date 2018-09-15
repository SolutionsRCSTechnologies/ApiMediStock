import { Response } from 'express';
import { RoutingHandler } from './RoutingHandler';
class Utilies{
    SendResponse(res:Response, obj:any){
        if(obj){
            res.writeHead(200, {"Content-Type":"application/json"});
            res.write(JSON.stringify(obj));
        } else {
            res.writeHead(200, {"Content-Type":"application/json"});
            res.write("No data found!");
        }
    }

    SendErrorResponse(res:Response,err:Error){
        res.writeHead(500, {"Content-Type":"application/json"});
        res.write(JSON.stringify(err));
    }

    // async ShowEndPoints(reqData:any){
    //     let retVal:any[]=[];
    //     await RoutingHandler.forEach(route=>{
    //         retVal.push({name: route.name, endpoint: route.url});
    //     });
    //     return retVal;
    // }
}

export let Util = new Utilies();