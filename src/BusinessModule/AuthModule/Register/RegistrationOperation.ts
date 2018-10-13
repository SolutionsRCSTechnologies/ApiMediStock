import { RegistrationDetail, User } from '../../../CommonModule/DBEntities';
import { Util } from '../../../CommonModule/UtilHandler';
import { RegistrationDBHandle } from './RegistrationDBHandler';
import { RegisterUtilHandle } from './RegisterUtilHandler';
import { ObjectId, ObjectID } from 'bson';
import { MethodResponse } from '../../../CommonModule/Entities';
import { parse } from 'path';

class RegistrationOperations {

    async OwnerRegistrationProcess(reqData) {
        let retVal: MethodResponse = new MethodResponse();
        let result = null;
        try {
            let isOwnerIdAvailable = await RegistrationDBHandle.CheckExistingOwnerId(reqData);
            if (isOwnerIdAvailable && isOwnerIdAvailable.ErrorCode == 0 && isOwnerIdAvailable.Result) {
                //Get Owner User info
                let ownerInfo: User = await RegisterUtilHandle.GetOwnerUserDoc(reqData);
                ownerInfo.PersonId = await Util.GetCustomGuidStr('UO');
                ownerInfo.OwnerRefId = ownerInfo.PersonId;
                //Insert user details in User table as Owner
                let owneridResponse = await RegistrationDBHandle.InsertUserInfo(ownerInfo);
                if (owneridResponse) {
                    let ownerid = owneridResponse.Result;
                    //Get salesman user info if available
                    let salepersons: User[] = await RegisterUtilHandle.GetSalePersons(reqData.salepersons);
                    //Insert salesman user info in USER table and get user ids
                    let userIds: string[] = [];
                    if (salepersons && salepersons.length > 0) {
                        for (let i = 0; i < salepersons.length; i++) {
                            //Set owner id
                            salepersons[i].OwnerRefId = ownerid;
                            salepersons[i].PersonId = await Util.GetCustomGuidStr('US');
                            let uId = await RegistrationDBHandle.InsertUserInfo(salepersons[i]);
                            if (uId && uId.Result) {
                                userIds.push(uId.Result);
                            }
                        }
                    }
                    //Get Registration document with owner user info
                    let registrationObj = await RegisterUtilHandle.GetRegistrationInfoDoc(reqData);
                    registrationObj.OwnerRefId = ownerid;
                    registrationObj.Users = userIds;
                    registrationObj.RegId = await Util.GetCustomGuidStr('REG');
                    //Register users in registration table
                    result = await RegistrationDBHandle.RegisterOwner(registrationObj);
                    retVal = result;
                } else {
                    retVal = owneridResponse;
                }
            } else {
                //return response as owner id is not available
                retVal = isOwnerIdAvailable;
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async UserRegistrationProcess(reqData) {
        let retVal = new MethodResponse();
        try {
            //
            let ownerId = reqData.ownerid;
            let response = await RegistrationDBHandle.GetRegistrationDetail(ownerId);
            if (response.Result && response.ErrorCode == 0) {
                //Current users list
                let currentUsers: string[] = response.Result.users;
                let ownerrefid: string = response.Result.ownerrefid;
                if (!currentUsers) {
                    currentUsers = [];
                }
                //Get User info
                let userInfo: User = await RegisterUtilHandle.GetUserDoc(reqData);
                userInfo.PersonId = await Util.GetCustomGuidStr('US');
                userInfo.OwnerRefId = ownerrefid;
                //Insert user details in User table as Owner
                let userrefidResponse = await RegistrationDBHandle.InsertUserInfo(userInfo);
                if (userrefidResponse && userrefidResponse.ErrorCode == 0) {
                    let userrefid = userrefidResponse.Result;
                    //add new user's ref id in users array
                    currentUsers.push(userrefid);
                    //Update registration table
                    retVal = await RegistrationDBHandle.AddNewUserInRegistration(ownerrefid, userrefid, currentUsers);
                }
            } else {
                //return response as owner id is not available
                retVal = response;
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async ValidateRequest(req) {
        let isValid: boolean = true;
        try {
            if (req) {
                if (!(req.registrationtype && (req.registrationtype == 'OWNER' || req.registrationtype == 'USER'))) {
                    isValid = false;
                }
                if (req.registrationtype && req.registrationtype.trim().length > 0) {
                    switch (req.registrationtype.trim().toUpperCase()) {
                        case 'OWNER':
                            if (isValid && !(req.ownerid && req.password && req.emailid && req.ownerfirstname && req.mobileno && req.druglicense && req.shopname && req.address && req.country)) {
                                isValid = false;
                            }
                            break;
                        case 'USER':
                            if (isValid && !req.ownerid) {
                                isValid = false;
                            }
                            break;
                    }
                }
                if (isValid && req.users && req.users.length > 0) {
                    req.users.foreach(ele => {
                        if (ele) {
                            if (isValid && !(ele.firstname && ele.userid && ele.password && ele.address && ele.mobileno && ele.emailid)) {
                                isValid = false;
                            }
                        } else {
                            isValid = false;
                        }
                    });
                }
            } else {
                isValid = false;
            }
        } catch (e) {
            isValid = false;
        }
        return isValid;
    }

    async RegistrationProcess(reqData) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (reqData && reqData.content) {
                let content = reqData.content;
                //Validate request data
                if (await this.ValidateRequest(content)) {
                    let registrationType: string = content.registrationtype;
                    if (registrationType && registrationType.length > 0) {
                        switch (registrationType.toLocaleUpperCase()) {
                            case "OWNER":
                                retVal = await this.OwnerRegistrationProcess(content);
                                break;
                            case "USER":
                                retVal = await this.UserRegistrationProcess(content);
                                break;
                        }
                    } else {
                        //Registration type is not declared
                        retVal.ErrorCode = 5;
                        retVal.Message = 'Registration type must be declared.';
                    }
                } else {
                    retVal.ErrorCode = 7;
                    retVal.Message = 'The requset data is not valid.';
                }
            } else {
                //Empty response
                retVal.ErrorCode = 6;
                retVal.Message = 'Request data do not contain sufficient information.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }


}

export let RegistrationOpHandle = new RegistrationOperations();