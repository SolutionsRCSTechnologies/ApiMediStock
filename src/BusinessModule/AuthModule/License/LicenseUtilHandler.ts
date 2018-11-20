import { LicenseDetail } from '../../../CommonModule/DBEntities';
import { MethodResponse } from '../../../CommonModule/Entities';
import { isDate } from 'util';

class LicenseUtilHandler {

    async GetLicenseInstance(req: any) {
        let retVal: LicenseDetail = new LicenseDetail();
        try {
            if (req) {
                if (req.ownerid && req.ownerid.length > 0) {
                    retVal.OwnerId = req.ownerid.trim();
                }
                if (req.lictype && req.lictype.length > 0) {
                    retVal.LicType = req.lictype.trim();
                }
                if (req.maxuser && req.maxuser > 0) {
                    retVal.MaxUsers = req.maxuser;
                }
                if (req.userdb && req.userdb.length > 0) {
                    retVal.UserDB = req.userdb.trim();
                }
                // if (req.userdburl && req.userdburl.length > 0) {
                //     retVal. = req.userdburl.trim();
                // }
                if (req.userdburl && req.userdburl.length > 0) {
                    retVal.UserDBUrl = req.userdburl.trim();
                }
                if (req.licstartdat && isDate(req.llicstartdate)) {
                    retVal.LicStartDate = req.licstartdate;
                }
                if (req.licenddate && isDate(req.licenddate)) {
                    retVal.LicEndDate = req.licenddate;
                }
                retVal.Active = 'Y';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

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
            if (!(req.modifyifany && req.modifyifany.length > 0)) {
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
}

export let LicenseUtilHandle = new LicenseUtilHandler();