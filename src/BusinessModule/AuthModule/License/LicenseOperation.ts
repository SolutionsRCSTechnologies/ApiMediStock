import { LicenseDBHandle } from './LicenseDBHandler';
import { LicenseUtilHandle } from './LicenseUtilHandler';
import { LicenseType } from "./../../../CommonModule/DBEntities";
import { MethodResponse } from '../../../CommonModule/Entities';
import { Util } from '../../../CommonModule/UtilHandler';
import { RegistrationOpHandle } from '../Register/RegistrationOperation';
import { Long } from 'bson';
import { isDate } from 'util';
import { LicenseDetail, LicensePurchase } from '../../../CommonModule/DBEntities';

class LicenseOpHandler {

    async ValidateLicense(licid: string) {
        let isValid: boolean = false;
        try {
            if (licid) {
                isValid = await LicenseDBHandle.ValidateLicense(licid);
            }
        } catch (e) {
            throw e;
        }
        return isValid;
    }

    async CreateUserCollections(ownerId: string, licId: string) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (ownerId && licId && ownerId.length > 0 && licId.length > 0) {
                retVal = await LicenseDBHandle.CreateCollections(ownerId, licId);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Ownerid or License id or both are missing.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async GetUserDBName(userName: string) {
        let dbName: string = '';
        try {
            if (userName && userName.length > 0) {
                let dbInitial: string = '';
                if (userName.length < 5) {
                    dbInitial = 'UDBXYZ';
                } else {
                    dbInitial = 'UDB' + userName.substring(0, 4);
                }
                dbName = dbInitial + await Util.GetGuidStr();
            }
        } catch (e) {
            throw e;
        }
        return dbName;
    }

    async CreateUserDB(userName: string, licId: string) {
        let isProcessDone: boolean = false;
        let output: MethodResponse = new MethodResponse();
        try {
            if (userName && userName.length > 0) {
                let dbName: string = await this.GetUserDBName(userName);
                let isDBCreated: boolean = await LicenseDBHandle.CreateUserDB(dbName);
                if (isDBCreated) {
                    //First Update UserDB name in Registration table. set collection creation completed as false.
                    output = await RegistrationOpHandle.UpdateUserDBName(userName, licId, dbName);
                    output = await RegistrationOpHandle.UpdateCollectionCreationStatus(userName, licId, 'START');
                    //Create userDB collections creation.
                    output = await LicenseDBHandle.CreateCollections(userName, licId);
                    //Set collection creation completed as true.
                    output = await RegistrationOpHandle.UpdateCollectionCreationStatus(userName, licId, 'DONE');
                    isProcessDone = true;
                }
            }
        } catch (e) {
            throw e;
        }
        return isProcessDone;
    }

    async RegisterLicense(req: any) {
        let retVal: MethodResponse = new MethodResponse();
        let output: MethodResponse = new MethodResponse();
        let errorCode: number = 0;
        let result: any = null;
        try {
            let isValid: boolean = await LicenseUtilHandle.ValidateLicRegistrationReq(req);
            if (isValid) {
                //Check for existing Registration and DataBase
                let licId: string = '';
                let licType: string = req.lictype;
                let isLicensed: boolean = false;
                let maxusercount: number = 0;
                let isDBExist: boolean = false;

                output = await RegistrationOpHandle.GetOwnerRegistrationInfo(req.ownerid);
                if (output && output.Result && output.ErrorCode == 0) {
                    licId = output.Result.licid;
                    isLicensed = output.Result.licensed == 'Y';
                    isDBExist = output.Result.isdbcreated == 'Y';
                    maxusercount = output.Result.maxusercount;
                    //Check for existing License if any
                    let isNewLicense: boolean = false;
                    if (licId && licId.length > 0) {
                        output = null;
                        output = await LicenseDBHandle.CheckExistingLicense(licId);
                        if (output && output.ErrorCode != 0) {
                            isNewLicense = true;
                        } else if (output && output.Result) {
                            //Check for pending amount of existing license if any
                            result = output.Result;
                            let currentDate = new Date();
                            if (result.pendingamount > 0) {
                                errorCode = 3;
                            } else if (result.expiredate >= currentDate) {
                                let modifyIfAny: boolean = req.modifyifany && req.modifyifany == 'Y';
                                if (modifyIfAny) {
                                    //TBD: Inactive existing license
                                    //isNewLicense = true;
                                } else {
                                    errorCode = 4;
                                }
                            } else {
                                isNewLicense = true;
                            }
                        } else {
                            //DB error
                            errorCode = 5;
                        }
                    } else {
                        isNewLicense = true;
                    }
                    if (isNewLicense && errorCode == 0) {
                        //Get License Type info
                        output = null;
                        licType = req.lictype;
                        output = await LicenseDBHandle.GetLicenseTypeInfo(licType);
                        let startDt: Date = new Date();
                        let endDt: Date = new Date();
                        if (req.licstartdt && isDate(req.licstartdt)) {
                            startDt = req.licstartdt;
                        }
                        if (output && output.ErrorCode == 0 && output.Result) {
                            let typeResult = output.Result;
                            let duration: number = 0;
                            let subsType: string = '';
                            let isDaily: boolean = req.isdaily && req.isdaily.trim().toUpperCase() == 'Y';
                            let isMonthly: boolean = req.ismonthly && req.ismonthly.trim().toUpperCase() == 'Y';
                            let isYearly: boolean = req.isyearly && req.isyearly.trim().toUpperCase() == 'Y';
                            if (typeResult.subscriptionlength && typeResult.subscriptionlength > 0) {
                                duration = typeResult.subscriptionlength;
                            }
                            if (req.subscriptiontype && typeResult.subscriptiontype > 0) {
                                subsType = typeResult.subscriptiontype.trim().toUpperCase();
                                switch (subsType) {
                                    case 'DAILY':
                                        if (isDaily) {
                                            let curDay: number = endDt.getDate();
                                            endDt.setDate(curDay + duration);
                                        } else {
                                            errorCode = 8;
                                        }
                                        break;
                                    case 'MONTHLY':
                                        if (isMonthly) {
                                            let curMon: number = endDt.getMonth();
                                            endDt.setMonth(curMon + duration);
                                        } else {
                                            errorCode = 9;
                                        }
                                        break;
                                    case 'YEARLY':
                                        if (isYearly) {
                                            let curYear: number = endDt.getFullYear();
                                            endDt.setFullYear(curYear + duration);
                                        } else {
                                            errorCode = 10;
                                        }
                                        break;
                                    default:
                                        errorCode = 11;
                                        break;
                                }
                            }
                            if (errorCode == 0) {
                                let reqObj: any = {
                                    lictype: typeResult.type,
                                    maxusers: typeResult.maxusers,
                                    ownerid: req.ownerid,
                                    licstartdate: startDt,
                                    licenddate: endDt,
                                    substype: subsType,
                                    yearlyprice: typeResult.yearlyprice,
                                    monthlyprice: typeResult.monthlyprice,
                                    dailyprice: typeResult.dailyprice,
                                    duration: duration
                                };
                                let licObj: LicenseDetail = await LicenseUtilHandle.GetLicenseInstance(reqObj);
                                //create new license
                                output = null;
                                output = await LicenseDBHandle.CreateNewLicense(licObj);
                                if (output && output.ErrorCode == 0 && output.Result && output.Result.length > 0) {
                                    licId = output.Result;
                                    //Create a License purchase entry in DataBase
                                    output = null;
                                    let licPurchaseObj: LicensePurchase = null;
                                    licPurchaseObj = await LicenseUtilHandle.GetLicensePurchaseInstance(licId, reqObj);
                                    //Entry to License Purchase Collection
                                    output = await LicenseDBHandle.CreateNewLicensePurchase(licPurchaseObj);
                                    //Update payment information (Create payment table entry during registration)
                                    if (isDBExist) {
                                        //Extend existing registraion information
                                        //TBD: update license id in existing registration info
                                        output = await RegistrationOpHandle.UpdateLicenseStatus(req.ownerid, licId, true);
                                    } else {
                                        output = await RegistrationOpHandle.UpdateLicenseStatus(req.ownerid, licId, true);
                                        let isProcessDone: boolean = await this.CreateUserDB(req.ownerid, licId);
                                        //TBD: Update DB creation in registration detail collection.
                                    }
                                } else {
                                    errorCode = 12;
                                }
                            }
                        } else {
                            errorCode = 7;
                        }
                    } else if (!isNewLicense && errorCode == 0) {
                        //TBD: update existing license info
                    } else {
                        errorCode = 6;
                    }
                } else {
                    errorCode = 2;
                }
            } else {
                errorCode = 1;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 1:
                    retVal.Message = 'License registration request is not valid.';
                    break;
                case 2:
                    retVal.Message = 'User does not have valid owner registration.';
                    break;
                case 3:
                    retVal.Message = '';
                    break;
                case 4:
                    retVal.Message = '';
                    break;
                case 5:
                    retVal.Message = '';
                    break;
                case 6:
                    retVal.Message = '';
                    break;
                default:
                    retVal.Result = result;
                    break;
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }
}

export let LicenseOpHandle = new LicenseOpHandler();