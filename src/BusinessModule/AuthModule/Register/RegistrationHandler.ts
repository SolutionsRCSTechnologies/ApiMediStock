import { RegistrationOpHandle } from './RegistrationOperation';
import { MethodResponse } from '../../../CommonModule/Entities';

class RegistrationHandler {
    async Register(header: any, body: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (header && body) {
                retVal = await RegistrationOpHandle.RegistrationProcess(body, header);
                console.log(retVal);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Request body cannot be null or empty.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async ActivateUser(header: any, body: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (header) {
                retVal = await RegistrationOpHandle.ActivateUser(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Request body cannot be null or empty.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async ValidateUserType(usertype: string) {
        let retVal: boolean = false;
        try {
            if (usertype && usertype.length > 0) {
                switch (usertype.trim().toUpperCase()) {
                    case "STOCKIST":
                    case "SALESMAN":
                        retVal = true;
                        break;
                }
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async GetAllUserIds(body: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            retVal = await RegistrationOpHandle.GetAllUserIds(body);
        } catch (error) {

        }
        return retVal;
    }
}

export let RegistrationHandle = new RegistrationHandler();