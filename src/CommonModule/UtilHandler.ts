import { Response } from 'express';
import { RoutingHandler } from './RoutingHandler';
import { Guid } from 'guid-typescript';
import { MethodResponse, ResponseEntity } from './Entities';
class Utilies {
    SendResponse(res: Response, obj: MethodResponse) {
        if (obj) {
            let retVal: ResponseEntity = new ResponseEntity();
            retVal.Header.ErrorCode = obj.ErrorCode;
            retVal.Header.Message = obj.Message;
            retVal.Header.SessionId = obj.SessionId;
            retVal.Header.ElapsedTo = obj.ElapsedTo;
            retVal.Body = obj.Result;
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(retVal));
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write("No data found!");
        }
    }

    SendErrorResponse(res: Response, err: Error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.write(JSON.stringify(err));
    }

    async GetCustomGuidStr(initialStr?: string, endStr?: string) {
        let gid: string = (initialStr ? initialStr.trim() : '') + Guid.raw() + (endStr ? endStr.trim() : '');
        return gid;
    }
    async GetGuidStr() {
        let gid: string = Guid.raw();
        return gid;
    }

    async ValidateRequsetStructure(req: any) {
        let isValid: boolean = false;
        try {
            if (req) {
                if (req.header && req.header.userid && req.header.userid.length > 0) {
                    if ((req.header.password && req.header.password.length > 0) ||
                        (req.header.sessionid && req.header.sessionid.length > 0)) {
                        isValid = true;
                    }
                }
            }
        } catch (e) {
            throw e;
        }
        return isValid;
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