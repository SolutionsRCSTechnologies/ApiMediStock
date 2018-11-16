import { LicenseDBHandle } from './LicenseDBHandler';
import { LicenseType } from "./../../../CommonModule/DBEntities";
import { MethodResponse } from '../../../CommonModule/Entities';
import { Util } from '../../../CommonModule/UtilHandler';
import { RegistrationOpHandle } from '../Register/RegistrationOperation';
import { Long } from 'bson';

class LicenseOpHandler {

    async ValidateLicRegistrationReq(req: any) {
        let retVal: boolean = true;
        if (req) {
            if (!(req.lictype && req.lictype.length > 0)) {
                retVal = false;
            }
            if (!(req.subscriptiontype && req.subscriptiontype.length)) {
                retVal = false;
            }
            if (!(req.subscriptionlength && req.subscriptionlength > 0)) {
                retVal = false;
            }
            if (!(req.ownerid && req.ownerid.length > 0)) {
                retVal = false;
            }
            if (req.paymentdetail) {
                if (!(req.paidamount && req.paidamount > 0)) {
                    retVal = false;
                }
            }
        } else {
            retVal = false;
        }
        return retVal;
    }

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
        try {
            let isValid: boolean = await this.ValidateLicRegistrationReq(req);
            if (isValid) {
                //Check for existing Registration and DataBase
                let licId: string = '';
                let isLicensed: boolean = false;
                let maxusercount: number = 0;
                output = await RegistrationOpHandle.GetOwnerRegistrationInfo(req.ownerid);
                if (output && output.Result) {
                    licId = output.Result.licid;
                    isLicensed = output.Result.licensed == 'Y';
                    maxusercount = output.Result.maxusercount;
                }
                //Check for existing License if any
                let isNewLicense: boolean = false;
                if (licId && licId.length > 0) {
                    output = await LicenseDBHandle.CheckExistingLicense(licId);
                    if (output && output.ErrorCode != 0) {
                        isNewLicense = true;
                    } else if (output && output.Result) {
                        //Check for pending amount of existing license if any
                    }
                } else {
                    isNewLicense = true;
                }
                //Create or update license table
                let isExist: boolean = false;
                //Check for exiting USERDB
                //Update payment information (Create payment table entry during registration)
                output = await RegistrationOpHandle.UpdateLicenseStatus(req.ownerid, licId, true);
                if (isExist) {
                    //Extend existing registraion information
                } else {
                    let isProcessDone: boolean = await this.CreateUserDB(req.ownerid, licId);
                }
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'License registration request is not valid.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }


}

export let LicenseOpHandle = new LicenseOpHandler();