import { RegistrationDetail, User } from '../../../CommonModule/DBEntities';
import { Util } from '../../../CommonModule/UtilHandler';
import { LoginDBHandle } from './LoginDBHandler';
import { LoginUtilHandle } from './LoginUtilHandler';
import { MethodResponse } from '../../../CommonModule/Entities';

class LoginOperations {
    async ValidateLoginRequest(reqData: any) {
        let isValid = true;
        return isValid;
    }

    async ValidateHeaderRequest(header: any) {
        let isValid = true;
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
                    //
                } else {
                    retVal.ErrorCode = 2;
                    retVal.Message = 'The header request is not valid.';
                }
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Header request is empty.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }
}

export let LoginOpHandle = new LoginOperations();