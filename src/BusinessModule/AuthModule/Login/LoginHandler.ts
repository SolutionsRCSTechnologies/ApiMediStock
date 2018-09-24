import { LoginDBHandle } from './LoginDBHandler';

class LoginHandler{

    async Validate(reqData:any){
        let isValid = true;
        return isValid;
    }

    async Login(reqData:any){
        let retVal = null;
        let obj = null;
        try{
            let isValid:boolean = false;
            await this.Validate(reqData).then(val=>{
                isValid = true;
            })
            .catch(err=>{
                isValid = false;
            });
            if(isValid){
                let useraName = reqData.username;
                let password = reqData.password;
                obj = await LoginDBHandle.Login(useraName,password);
                if(obj){
                    retVal = {
                        username: reqData.username,
                        sessionid: obj.sessionid
                    };
                }
            } else{
                retVal = {
                    message: "Invalid login"
                };
            }
        }
        catch(e){
            throw e;
        }
        return retVal;
    }

    
}


export let LoginHandle = new LoginHandler();