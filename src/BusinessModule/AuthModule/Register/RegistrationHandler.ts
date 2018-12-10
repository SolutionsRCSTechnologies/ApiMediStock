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

    // async ValidateRequest(reqData: any) {
    //     let retVal = true;
    //     try {
    //         if (reqData && reqData.Body) {
    //             // if(!reqData.Header.username){
    //             //     retVal = false;
    //             // }
    //             // if(!reqData.Header.password){
    //             //     retVal = false;
    //             // }
    //             if (!reqData.Body.stockistname) {
    //                 retVal = false;
    //             }
    //             if (!reqData.Body.drugid) {
    //                 retVal = false;
    //             }
    //             if (!reqData.Body.address) {
    //                 retVal = false;
    //             }
    //             if (!reqData.Body.name) {
    //                 retVal = false;
    //             }
    //             if (!(reqData.Body.owners && reqData.Body.owners.length > 0)) {
    //                 retVal = false;
    //             }
    //             if (!(reqData.Body.bankdetails && reqData.Body.bankdetails.accountnumber && reqData.Body.bankdetails.bankname && reqData.Body.bankdetails.accountholder)) {
    //                 retVal = false;
    //             }
    //             if (!reqData.Body.username) {
    //                 retVal = false;
    //             }
    //             if (!reqData.Body.password) {
    //                 retVal = false;
    //             }
    //             if (!reqData.Body.usertype) {
    //                 retVal = false;
    //             }
    //         } else {
    //             retVal = false;
    //         }
    //     } catch (e) {
    //         throw e;
    //     }
    //     return retVal;
    // }
}

export let RegistrationHandle = new RegistrationHandler();