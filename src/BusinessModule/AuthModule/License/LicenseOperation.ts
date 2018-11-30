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
                    output = await LicenseDBHandle.UpdateUserDBNameInLicense(licId, userName, dbName);
                    output = await RegistrationOpHandle.UpdateUserDBName(userName, licId, dbName);
                    output = await RegistrationOpHandle.UpdateCollectionCreationStatus(userName, licId, 'START');
                    //Create userDB collections creation.
                    output = await LicenseDBHandle.CreateCollections(userName, licId);
                    //Set collection creation completed as true.
                    output = await RegistrationOpHandle.UpdateCollectionCreationStatus(userName, licId, 'DONE');
                    isProcessDone = true;
                } else {
                    isProcessDone = false;
                }
            } else {
                isProcessDone = false;
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
                                    //Inactive existing license
                                    output = null;
                                    output = await LicenseDBHandle.ChangeActiveStatusOfLicense(licId, false);
                                    if (output && output.ErrorCode == 0 && output.Result) {
                                        isNewLicense = true;
                                    } else {
                                        errorCode = 13;
                                    }
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
                            let minDuration: number = 0;
                            let paymentClearLengthInDays: number = 0;
                            let isDaily: boolean = typeResult.isdaily && typeResult.isdaily.trim().toUpperCase() == 'Y';
                            let isMonthly: boolean = typeResult.ismonthly && typeResult.ismonthly.trim().toUpperCase() == 'Y';
                            let isYearly: boolean = typeResult.isyearly && typeResult.isyearly.trim().toUpperCase() == 'Y';
                            if (typeResult.minduration && typeResult.minduration > 0) {
                                minDuration = typeResult.minduration;
                            }
                            if (typeResult.paymentclearlengthindays && typeResult.paymentclearlengthindays > 0) {
                                paymentClearLengthInDays = typeResult.paymentclearlengthindays;
                            }
                            if (req.subscriptionlength && req.subscriptionlength > 0) {
                                duration = req.subscriptionlength;
                            }
                            if (duration >= minDuration) {
                                if (req.subscriptiontype && req.subscriptiontype > 0) {
                                    subsType = req.subscriptiontype.trim().toUpperCase();
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
                            } else {
                                errorCode = 14;
                            }
                            if (errorCode == 0) {
                                let paymentOption: any = req.paymentdetail ? req.paymentdetail : null;
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
                                    duration: duration,
                                    paymentoptions: paymentOption,
                                    expiredate: endDt,
                                    paymentclearlengthindays: paymentClearLengthInDays
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
                                    if (output && output.ErrorCode == 0 && output.Result) {
                                        //update license id in existing registration info
                                        output = null;
                                        output = await RegistrationOpHandle.UpdateLicenseIdInRegistration(req.ownerid, licId);
                                        if (output && output.ErrorCode == 0 && output.Result) {
                                            output = null;
                                            output = await RegistrationOpHandle.UpdateLicenseStatus(req.ownerid, licId, true);
                                            if (output && output.ErrorCode == 0 && output.Result) {
                                                if (!isDBExist) {
                                                    //Extend existing registraion information
                                                    if (await this.CreateUserDB(req.ownerid, licId)) {
                                                        result = 'License registration is completed successfully.'
                                                    } else {
                                                        result = 'License registration is successful but some error occurred during user database creation.';
                                                    }
                                                } else {
                                                    result = 'Owner has existing database to reuse and license subscription is successful.';
                                                }
                                            } else {
                                                errorCode = 17;
                                            }
                                        } else {
                                            errorCode = 16;
                                        }
                                    } else {
                                        errorCode = 15;
                                    }
                                } else {
                                    errorCode = 12;
                                }
                            }
                        } else {
                            errorCode = 7;
                        }
                    } else {
                        errorCode = errorCode > 0 ? errorCode : 6;
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
                    retVal.Message = 'Owner has pending amount to pay for existing license.';
                    break;
                case 4:
                    retVal.Message = 'Owner has existing active license and not requested for modify existing.';
                    break;
                case 5:
                    retVal.Message = 'Some error occurred during existing license validation.';
                    break;
                case 6:
                    retVal.Message = 'Not satisfied the conditions for new license creation.';
                    break;
                case 7:
                    retVal.Message = 'Error occurred to fetch the license type information.';
                    break;
                case 8:
                    retVal.Message = 'Requested license is not available for DAILY subscription.';
                    break;
                case 9:
                    retVal.Message = 'Requested license is not available for MONTHLY subscription.';
                    break;
                case 10:
                    retVal.Message = 'Requested license is not available for YEARLY subscription.';
                    break;
                case 11:
                    retVal.Message = 'Requested subscription type is not valid. It should be either DAILY/MONTHLY/YEARLY.';
                    break;
                case 12:
                    retVal.Message = 'Some error occurred during new license creation for the owner.';
                    break;
                case 13:
                    retVal.Message = 'Owner has requested to modify existing license but some error occurred during the change of existing license status.';
                    break;
                case 14:
                    retVal.Message = 'Owner request does not statisfy the minimum duration clause of license subscription.';
                    break;
                case 15:
                    retVal.Message = 'Error occurred during new license purchase information creation.';
                    break;
                case 16:
                    retVal.Message = 'Error occurred during license id update in registration table.';
                    break;
                case 17:
                    retVal.Message = 'Error occurred during license status update.';
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