import { LoginDBHandle } from './LoginDBHandler';
import { MethodResponse } from '../../../CommonModule/Entities';

class LoginOperations {
    async ValidateLoginRequest(reqData: any) {
        let isValid = true;
        if (reqData) {
            if (!(reqData.userid && reqData.userid.length > 0)) {
                isValid = false;
            }
            if (!(reqData.password && reqData.password.length > 0)) {
                isValid = false;
            }
        } else {
            isValid = false;
        }
        return isValid;
    }

    async ValidateHeaderRequest(header: any) {
        let isValid = true;
        if (header) {
            if (!(header.sessionid && header.sessionid.length > 0)) {
                isValid = false;
            }
        } else {
            isValid = false;
        }
        return isValid;
    }

    async LoginProcess(req) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (req) {
                if (await this.ValidateLoginRequest(req)) {
                    retVal = await LoginDBHandle.ValidateLogin(req);
                } else {
                    retVal.ErrorCode = 2;
                    retVal.Message = "Login request is not valid.";
                }
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = "Login request is empty, cannot validated.";
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async ValidateHeader(header) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (header) {
                if (await this.ValidateHeader(header)) {
                    retVal = await LoginDBHandle.ValidateHeader(header);
                } else {
                    retVal.ErrorCode = 2;
                    retVal.Message = 'The header request is not valid.';
                }
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'The header is empty.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }
}

export let LoginOpHandle = new LoginOperations();