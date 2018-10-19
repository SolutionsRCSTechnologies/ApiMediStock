import { RegistrationDetail, User } from '../../../CommonModule/DBEntities';
import { Util } from '../../../CommonModule/UtilHandler';
import { } from './LoginDBHandler';
import { LoginUtilHandle } from './LoginUtilHandler';
import { MethodResponse } from '../../../CommonModule/Entities';

class LoginOperations {
    async ValidateLoginRequest(reqData: any) {
        let isValid = true;
        return isValid;
    }

    async LoginProcess(req) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (req) {
                if (await this.ValidateLoginRequest(req)) {
                    //
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
        //
    }
}

export let LoginOpHandle = new LoginOperations();