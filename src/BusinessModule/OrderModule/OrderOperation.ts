import { RegistrationDetail, User } from '../../CommonModule/DBEntities';
import { OrderUtilHandle } from "./OrderUtilHandler";
import { Util } from '../../CommonModule/UtilHandler';
import { OrderDBHandle } from './OrderDBHandler';
import { MethodResponse } from '../../CommonModule/Entities';
import { LoginHandle } from '../AuthModule/Login/LoginHandler';

class OrderOpHandler {
    async GetOrderList(header: any, body: any) {
        let retVal: MethodResponse = new MethodResponse();
        let output: MethodResponse = null;
        try {
            if (await OrderUtilHandle.ValidateOrderDetailsRequest(body)) {
                //Validate header
                output = await LoginHandle.ValidateHeader(header);
                if (output && output.ErrorCode == 0 && output.Result) {
                    let userDBName: string = output.Result ? output.Result.userdbname : '';
                    let userDBUrl: string = output.Result ? output.Result.userdburl : '';
                    if (userDBName && userDBName.length > 0) {
                        //TBD: Get order list
                    } else {
                        retVal.ErrorCode = 3;
                        retVal.Message = 'There are some error on selecting user db name.';
                    }
                    retVal = await Util.SetOutputResponse(output, retVal);
                } else {
                    retVal.ErrorCode = 2;
                    retVal.Message = 'User should be logged in system before request.';
                }
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request for order list.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }
}

export let OrderOpHandle = new OrderOpHandler();