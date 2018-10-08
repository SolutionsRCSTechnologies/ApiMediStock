import { RegistrationDetail, User } from '../../../CommonModule/DBEntities';
import { Util } from '../../../CommonModule/UtilHandler';
import { RegistrationDBHandle } from './RegistrationDBHandler';
import { RegisterUtilHandle } from './RegisterUtilHandler';
import { ObjectId, ObjectID } from 'bson';

class RegistrationOperations {


    RegistrationProcess(reqData) {
        let retVal = null;
        try {
            if (reqData) {
                let registrationType: string = reqData.registrationtype;
                if (registrationType && registrationType.length > 0) {
                    switch (registrationType.toLocaleUpperCase()) {
                        case "OWNER":
                            retVal = this.OwnerRegistrationProcess(reqData);
                            break;
                        case "USER":
                            retVal = this.UserRegistrationProcess(reqData);
                            break;
                    }
                }
            } else {
                //Empty response   
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async OwnerRegistrationProcess(reqData) {
        let retVal = null;
        try {
            let isOwnerIdAvailable = await RegistrationDBHandle.CheckExistingOwnerId(reqData);
            if (isOwnerIdAvailable) {
                //Get Owner User info
                let ownerInfo: User = await RegisterUtilHandle.GetOwnerUserDoc(reqData);
                //Insert user details in User table as Owner
                let ownerid: ObjectId = await RegistrationDBHandle.InsertUserInfo(ownerInfo);
                //Get salesman user info if available
                let salepersons: User[] = await RegisterUtilHandle.GetSalePersons(reqData.salepersons);
                //Insert salesman user info in USER table and get user ids
                let userIds: ObjectID[] = [];
                if (salepersons && salepersons.length > 0) {
                    for (let i = 0; i < salepersons.length; i++) {
                        //Set owner id
                        salepersons[i].OwnerRefId = ownerid;
                        let uId: ObjectID = await RegistrationDBHandle.InsertUserInfo(salepersons[i]);
                        userIds.push(uId);
                    }
                }
                //Get Registration document with owner user info
                let registrationObj = await RegisterUtilHandle.GetRegistrationInfoDoc(reqData);
                registrationObj.OwnerRefId = ownerid;
                registrationObj.SalePersons = userIds;
                registrationObj.RegId = await Util.GetCustomGuidStr('REG');
                //Register users in registration table
                retVal = await RegistrationDBHandle.RegisterNew(registrationObj);
            } else {
                //return response as owner id is not available
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    UserRegistrationProcess(reqData) {
        let retVal = null;
        try {
            //
        } catch (e) {
            throw e;
        }
        return retVal;
    }
}

export let RegistrationOpHandle = new RegistrationOperations();