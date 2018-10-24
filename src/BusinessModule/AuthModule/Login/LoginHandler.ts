import { LoginOpHandle } from './LoginOperation';
import { MethodResponse } from '../../../CommonModule/Entities';

class LoginHandler {

    async Login(reqData) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (reqData && reqData.content) {
                let content = reqData.content;
                retVal = await LoginOpHandle.LoginProcess(content);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = "Empty login request.";
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async ValidateHeader(header: any) {
        let retVal: MethodResponse = null;
        try {
            retVal = await LoginOpHandle.ValidateHeader(header);
        } catch (e) {
            throw e;
        }
        return retVal;
    }
}


export let LoginHandle = new LoginHandler();