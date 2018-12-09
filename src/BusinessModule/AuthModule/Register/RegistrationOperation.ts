import { RegistrationDetail, User } from '../../../CommonModule/DBEntities';
import { RegisterUtilHandle } from "./RegisterUtilHandler";
import { Util } from '../../../CommonModule/UtilHandler';
import { RegistrationDBHandle } from './RegistrationDBHandler';
import { ObjectId, ObjectID } from 'bson';
import { MethodResponse } from '../../../CommonModule/Entities';
import { parse } from 'path';
import { triggerAsyncId } from 'async_hooks';

class RegistrationOperations {

    async OwnerRegistrationProcess(reqData) {
        let retVal: MethodResponse = new MethodResponse();
        let result = null;
        try {
            let isOwnerIdAvailable = await RegistrationDBHandle.CheckExistingOwnerId(reqData);
            if (isOwnerIdAvailable && isOwnerIdAvailable.ErrorCode == 0 && isOwnerIdAvailable.Result == true) {
                //Get Owner User info
                let ownerInfo: User = await RegisterUtilHandle.GetOwnerUserDoc(reqData);
                //ownerInfo.PersonId = await Util.GetCustomGuidStr('UO');
                ownerInfo.OwnerRefId = ownerInfo.PersonId;
                //Insert user details in User table as Owner
                let owneridResponse = await RegistrationDBHandle.InsertUserInfo(ownerInfo);
                if (owneridResponse) {
                    let ownerid = owneridResponse.Result;
                    //Get salesman user info if available
                    let salepersons: User[] = await RegisterUtilHandle.GetSalePersons(reqData.users);
                    //Insert salesman user info in USER table and get user ids
                    let userIds: string[] = [];
                    if (salepersons && salepersons.length > 0) {
                        for (let i = 0; i < salepersons.length; i++) {
                            //Set owner id
                            salepersons[i].OwnerRefId = ownerid;
                            //salepersons[i].PersonId = await Util.GetCustomGuidStr('US');
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
                    //registrationObj.RegId = await Util.GetCustomGuidStr('REG');
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
                let salepersons: User[] = await RegisterUtilHandle.GetSalePersons(reqData.users);
                //Insert salesman user info in USER table and get user ids
                let unregistereduserids: string[] = [];
                if (salepersons && salepersons.length > 0) {
                    for (let i = 0; i < salepersons.length; i++) {
                        let subResult = await RegistrationDBHandle.CheckExistingUserId(salepersons[i].UserId);
                        if (subResult && subResult.ErrorCode == 0) {
                            //Set owner id
                            salepersons[i].OwnerRefId = ownerId;
                            //salepersons[i].PersonId = await Util.GetCustomGuidStr('US');
                            let uId = await RegistrationDBHandle.InsertUserInfo(salepersons[i]);
                            if (uId && uId.Result) {
                                if (currentUsers.findIndex(uId.Result) < 0) {
                                    currentUsers.push(uId.Result);
                                }
                            }
                        } else {
                            unregistereduserids.push(salepersons[i].UserId);
                        }
                    }
                    retVal = await RegistrationDBHandle.AddNewUserInRegistration(ownerrefid, currentUsers);
                    retVal.Result = {
                        registeredusers: currentUsers,
                        unregisteredusers: unregistereduserids
                    }
                } else {
                    retVal.Message = 'There are no user for registration.';
                    retVal.ErrorCode = 7;
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

    async RegistrationProcess(body: any, header?: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (body) {
                let content = body;
                //Validate request data
                if (await RegisterUtilHandle.ValidateRequest(content)) {
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

    async ActivateUser(header: any, body: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (header) {
                let content = body;
                //Validate request
                if (await RegisterUtilHandle.ValidateActivateUserRequest(content)) {
                    if (content.ownerid) {
                        let isActivate = false;
                        if (content.userid) {
                            //Find by owner id match with user id and activate the user
                            if (content.active && content.active == 'Y') {
                                isActivate = true;
                            }
                            retVal = await RegistrationDBHandle.ActivateUser(content.ownerid, content.userid, isActivate);
                        } else {
                            retVal.ErrorCode = 4;
                            retVal.Message = 'User id must be present.';
                        }
                    } else {
                        retVal.ErrorCode = 3;
                        retVal.Message = 'Owner id must be present.';
                    }
                } else {
                    retVal.ErrorCode = 2;
                    retVal.Message = 'Request is not valid.';
                }
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Empty request data.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async UpdateUserDBName(ownerId: string, licId: string, userDBName: string, dbUrl?: string) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (ownerId && licId && ownerId.length > 0 && licId.length > 0) {
                if (userDBName && userDBName.length > 0) {
                    dbUrl = dbUrl && dbUrl.length > 0 ? dbUrl : '';
                    retVal = await RegistrationDBHandle.UpdateUserDBName(ownerId, licId, userDBName, dbUrl);
                } else {
                    retVal.ErrorCode = 2;
                    retVal.Message = 'User DataBase name is empty.';
                }
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Owner id or License id is empty.';
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
        return retVal;
    }

    async UpdateLicenseStatus(ownerId: string, licId: string, isLicensed: boolean) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (ownerId && licId && ownerId.length > 0 && licId.length > 0) {
                retVal = await RegistrationDBHandle.UpdateLicenseStatus(ownerId, licId, isLicensed);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Owner id or License id is empty.';
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
        return retVal;
    }

    async UpdateCollectionCreationStatus(ownerId: string, licid: string, status: string) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (ownerId && licid && ownerId.length > 0 && licid.length > 0) {
                if (status && status.length > 0) {
                    let stat: string = '';
                    switch (status.toUpperCase()) {
                        case 'START':
                            stat = 'S';
                            break;
                        case 'PENDING':
                            stat = 'N';
                            break;
                        case 'PROGRESS':
                            stat = 'P';
                            break;
                        case 'DONE':
                            stat = 'Y';
                            break;
                    }
                    retVal = await RegistrationDBHandle.UpdateCollectionStatus(ownerId, licid, stat);
                } else {
                    retVal.ErrorCode = 2;
                    retVal.Message = 'User DataBase name is empty.';
                }
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Owner id or License id is empty.';
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
        return retVal;
    }

    async GetOwnerRegistrationInfo(ownerId: string) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (ownerId && ownerId.length > 0) {
                retVal = await RegistrationDBHandle.GetOwnerRegistrationInfo(ownerId);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Empty owner id.';
            }
        } catch (e) {

        }
        return retVal;
    }

    async UpdateLicenseIdInRegistration(ownerId: string, licId: string, maxusers?: number) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            retVal = await RegistrationDBHandle.UpdateLicenseIdInRegistration(ownerId, licId, maxusers);
        } catch (e) {
            throw e;
        }
        return retVal;
    }
}

export let RegistrationOpHandle = new RegistrationOperations();