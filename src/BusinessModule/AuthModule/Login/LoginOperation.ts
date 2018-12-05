import { LoginDBHandle } from './LoginDBHandler';
import { MethodResponse } from '../../../CommonModule/Entities';
import { LoginUtilHandle } from './LoginUtilHandler';

class LoginOperations {
    async LoginProcess(header: any, body?: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (header) {
                if (await LoginUtilHandle.ValidateLoginRequest(header)) {
                    retVal = await LoginDBHandle.Login(header);
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
                if (await LoginUtilHandle.ValidateHeaderRequest(header)) {
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

    async Logout(header: any, body?: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (header) {
                if (await LoginUtilHandle.ValidateLogoutRequest(header)) {
                    let userId: string = header.userid;
                    let sessionId: string = header.sessionid;
                    retVal = await LoginDBHandle.Logout(userId, sessionId);
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
}

export let LoginOpHandle = new LoginOperations();