import { LicenseDetail, LicensePurchase, OrderDetail } from '../../CommonModule/DBEntities';
import { MethodResponse } from '../../CommonModule/Entities';
import { isDate } from 'util';
import { Double } from 'bson';

class OrderUtilHandler {
    async ValidateOrderDetailsRequest(req: any) {
        let isValid: boolean = true;
        try {
            if (req) {
                if (req.filtercriteria) {
                    if (!(req.filtercriteria.placedby && req.filtercriteria.placedby.length > 0)) {
                        isValid = false;
                    }
                    if (req.filtercriteria.datebetween) {
                        if (!(isDate(req.filtercriteria.datebetween.startdate))) {
                            isValid = false;
                        }
                        if (!(isDate(req.filtercriteria.datebetween.enddate))) {
                            isValid = false;
                        }
                        if (isValid) {
                            isValid = req.filtercriteria.datebetween.enddate > req.filtercriteria.datebetween.startdate;
                        }
                    }
                    if (req.filtercriteria.daterange) {
                        let range = req.filtercriteria.daterange.trim().toUpperCase();
                        switch (range) {
                            case 'LASTMONTH':
                            case 'LASTQUATER':
                            case 'LASTHALFYEAR':
                            case 'LASTYEAR':
                                break;
                            default:
                                isValid = false;
                                break;
                        }
                    }
                }
                if (req.displaycriteria) {
                    if (!(req.displaycriteria.sortoption && req.displaycriteria.sortoption.length > 0)) {
                        isValid = false;
                    }
                    if (req.displaycriteria.contentsize) {
                        if (!(req.displaycriteria.contentsize.startindex && req.displaycriteria.contentsize.startindex > 0)) {
                            isValid = false;
                        }
                        if (!(req.displaycriteria.contentsize.pagesize && req.displaycriteria.contentsize.pagesize > 0)) {
                            isValid = false;
                        }
                    }
                }
            } else {
                isValid = false;
            }
        } catch (e) {
            throw e;
        }
        return isValid;
    }

    async CreateOrderDetail(ordObj: any, retailObj: any) {
        let retVal: OrderDetail = new OrderDetail();
        try {
            if (ordObj) {
                if (ordObj.userid && ordObj.userid.length > 0) {
                    retVal.OrderCreatedById = ordObj.userid;
                }
                if (ordObj.userid && ordObj.userid.length > 0) {
                    retVal.OrderCreatedById = ordObj.userid;
                }
                //TBD:
            }
        } catch (error) {
            throw error;
        }
        return retVal;
    }
}

export let OrderUtilHandle = new OrderUtilHandler();