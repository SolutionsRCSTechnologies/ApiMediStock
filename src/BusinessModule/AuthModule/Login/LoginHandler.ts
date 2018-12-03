import { LoginOpHandle } from './LoginOperation';
import { MethodResponse } from '../../../CommonModule/Entities';

class LoginHandler {

    async Login(header: any, body?: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (header) {
                retVal = await LoginOpHandle.LoginProcess(header);
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