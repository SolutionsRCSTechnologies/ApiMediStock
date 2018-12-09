import { LicenseDetail, LicensePurchase } from '../../../CommonModule/DBEntities';
import { MethodResponse } from '../../../CommonModule/Entities';
import { isDate } from 'util';
import { Double } from 'bson';

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
            if (!(req.subscriptionlength && !isNaN(req.subscriptionlength) && req.subscriptionlength > 0)) {
                retVal = false;
            }
            if (!(req.ownerid && req.ownerid.length > 0)) {
                retVal = false;
            }
            if (!(req.modifyifany && req.modifyifany.length > 0)) {
                retVal = false;
            }
            if (req.paymentdetail) {
                // if (!(req.paidamount && req.paidamount > 0)) {
                //     retVal = false;
                // }
                if (req.applydiscountamount && req.applydiscountamount.length > 0) {
                    if (!(req.discountamount && req.discountamount > 0)) {
                        retVal = false;
                    }
                }
                if (req.applydiscountpercentage && req.applydiscountpercentage.length > 0) {
                    if (!(req.discountpercentage && req.discountpercentage > 0)) {
                        retVal = false;
                    }
                }
            }
        } else {
            retVal = false;
        }
        return retVal;
    }

    async GetLicPurchaseInstance(req: any) {
        let retVal: LicensePurchase = new LicensePurchase();
        try {
            if (req) {
                if (req.licid && req.licid.length > 0) {
                    retVal.LicId = req.licid;
                }
                if (req.ownerid && req.ownerid.length > 0) {
                    retVal.OwnerId = req.ownerid;
                }
                if (req.applydiscountpercentage && req.applydiscountpercentage.length > 0) {
                    retVal.ApplyDiscountPercentage = req.applydiscountpercentage;
                } else {
                    retVal.ApplyDiscountPercentage = 'N';
                }
                if (req.applydiscountamount && req.applydiscountamount.length > 0) {
                    retVal.ApplyDiscountAmount = req.applydiscountamount;
                } else {
                    retVal.ApplyDiscountAmount = 'N';
                }
                // if (req.currpendingmonthlyamount && req.currpendingmonthlyamount > 0) {
                //     retVal.CurrentPendingMonthlyAmount = req.currpendingmonthlyamount;
                // } else {
                //     retVal.CurrentPendingMonthlyAmount = 0;
                // }
                // if (req.currpendingyearlyamount && req.currpendingyearlyamount > 0) {
                //     retVal.CurrentPendingYearlyAmount = req.currpendingyearlyamount;
                // } else {
                //     retVal.CurrentPendingYearlyAmount = 0;
                // }
                if (req.discountamount && req.discountamount > 0) {
                    retVal.DiscountAmount = req.discountamount;
                } else {
                    retVal.DiscountAmount = 0;
                }
                if (req.discountpercentage && req.discountpercentage > 0) {
                    retVal.DiscountPercentage = req.discountpercentage;
                } else {
                    retVal.DiscountPercentage = 0;
                }
                if (req.lastpaymentamount && req.lastpaymentamount > 0) {
                    retVal.LastPaymentAmount = req.lastpaymentamount;
                } else {
                    retVal.LastPaymentAmount = 0;
                }
                if (req.lastpaymentdt && isDate(req.lastpaymentdt)) {
                    retVal.LastPaymentDt = req.lastpaymentdt;
                } else {
                    retVal.LastPaymentDt = new Date(1, 1, 1);
                }
                if (req.lictype && req.lictype.length > 0) {
                    retVal.LicType = req.lictype;
                } else {
                    retVal.LicType = '';
                }
                // if (req.missedpaymentcyclecount && req.missedpaymentcyclecount > 0) {
                //     retVal.MissedPaymentCycleCount = req.missedpaymentcyclecount;
                // } else {
                //     retVal.MissedPaymentCycleCount = 1;
                // }
                // if (req.monthlypayableprice && req.monthlypayableprice > 0) {
                //     retVal.MonthlyPayablePrice = req.monthlypayableprice;
                // } else {
                //     retVal.MonthlyPayablePrice = 0;
                // }
                // if (req.monthlyprice && req.monthlyprice > 0) {
                //     retVal.MonthlyPrice = req.monthlyprice;
                // } else {
                //     retVal.MonthlyPrice = 0;
                // }
                // if (req.paymentoption && req.paymentoption.length > 0) {
                //     retVal.PaymentOption = req.paymentoption;
                // } else {
                //     retVal.PaymentOption = 'MONTHLY';
                // }
                if (req.subscriptionlength && req.subscriptionlength > 0) {
                    retVal.SubscriptionLength = req.subscriptionlength;
                } else {
                    retVal.SubscriptionLength = 0;
                }
                if (req.subscriptiontype && req.subscriptiontype.length > 0) {
                    retVal.SubscriptionType = req.subscriptiontype;
                } else {
                    retVal.SubscriptionType = 'DAILY';
                }
                if (req.totalpaidamount && req.totalpaidamount > 0) {
                    retVal.TotalPaidAmount = req.totalpaidamount;
                } else {
                    retVal.TotalPaidAmount = 0;
                }
                if (req.totalpendingamount && req.totalpendingamount > 0) {
                    retVal.TotalPendingAmount = req.totalpendingamount;
                } else {
                    retVal.TotalPendingAmount = req.totalprice > 0 ? req.totalprice : 0;
                }
                if (req.totalprice && req.totalprice > 0) {
                    retVal.TotalPrice = req.totalprice;
                } else {
                    retVal.TotalPrice = 0;
                }
                if (req.totalpayableamount && req.totalpayableamount > 0) {
                    retVal.TotalPayableAmount = req.totalpayableamount;
                } else {
                    retVal.TotalPayableAmount = 0;
                }
                if (req.totaldiscountamount && req.totaldiscountamount > 0) {
                    retVal.TotalDiscountAmount = req.totaldiscountamount;
                } else {
                    retVal.TotalDiscountAmount = 0;
                }
                if (req.paymentcleardate) {
                    retVal.PaymentClearDate = req.paymentcleardate;
                }
                // if (req.yearlyprice && req.yearlyprice > 0) {
                //     retVal.YearlyPrice = req.yearlyprice;
                // } else {
                //     retVal.YearlyPrice = 0;
                // }
                retVal.CreatedAt = new Date();
                retVal.UpdatedAt = new Date();
                retVal.CreatedBy = 'SYSTEM';
                retVal.UpdatedBy = 'SYSTEM';
                retVal.Active = 'Y';
            } else {
                retVal = null;
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async GetLicensePurchaseInstance(licid: string, reqObj: any) {
        let retVal: LicensePurchase = new LicensePurchase();
        try {
            let totalprice: number = 0;
            let totMonth: number = 0;
            let curMonth: number = new Date().getMonth();
            let payableAmount: number = 0;
            let discountedTotal: number = 0;

            if (reqObj) {
                switch (reqObj.substype) {
                    case 'DAILY':
                        totalprice = reqObj.duration * reqObj.dailyprice;
                        break;
                    case 'MONTHLY':
                        totalprice = reqObj.duration * reqObj.monthlyprice;
                        break;
                    case 'YEARLY':
                        totalprice = reqObj.duration * reqObj.yearlyprice;
                        break;
                }
                payableAmount = totalprice;
                let isDiscountPerApp: boolean = false;
                let isDiscountAmtApp: boolean = false;
                let discountAmt: number = 0;
                let discountPer: number = 0;
                let lastPaidAmt: number = 0;
                let totalPendingAmt: number = 0;
                let dtOfPaymentClearance: Date = new Date();
                let expireDate: Date = reqObj.expiredate && isDate(reqObj.expiredate) ? reqObj.expiredate : new Date();
                let paymentClearLengthDays: number = reqObj.paymentclearlengthindays && reqObj.paymentclearlengthindays > 0 ? reqObj.paymentclearlengthindays : 10;
                if (reqObj.paymentoptions) {
                    let payment = reqObj.paymentoptions;
                    isDiscountAmtApp = payment.applydiscountamount && payment.applydiscountamount.trim().toUpperCase() == 'Y';
                    isDiscountPerApp = payment.applydiscountpercentage && payment.applydiscountpercentage.trim().toUpperCase() == 'Y';
                    discountAmt = payment.discountamount && payment.discountamount > 0 ? payment.discountamount : 0;
                    discountPer = payment.discountpercentage && payment.discountpercentage > 0 ? payment.discountpercentage : 0;
                    lastPaidAmt = payment.paidamount && payment.paidamount > 0 ? payment.paidamount : 0;

                    if (isDiscountAmtApp) {
                        discountedTotal = discountAmt;
                    } else if (isDiscountPerApp) {
                        discountedTotal = (totalprice * discountPer) / 100;
                    }
                    payableAmount = discountedTotal > totalprice ? 0.0 : totalprice - discountedTotal;
                    totalPendingAmt = payableAmount - lastPaidAmt;
                    if (totalPendingAmt > 0) {
                        dtOfPaymentClearance.setDate(paymentClearLengthDays);
                    } else {
                        dtOfPaymentClearance = expireDate;
                    }
                }

                let req: any = {
                    lictype: reqObj.lictype,
                    ownerid: reqObj.ownerid,
                    subscriptiontype: reqObj.substype,
                    subscriptionlength: reqObj.duration,
                    licid: licid,
                    totalprice: totalprice,
                    totalpayableamount: payableAmount,
                    totaldiscountamount: discountedTotal,
                    applydiscountamount: isDiscountAmtApp ? 'Y' : 'N',
                    applydiscountpercentage: isDiscountPerApp ? 'Y' : 'N',
                    totalpaidamount: lastPaidAmt,
                    totalpendingamount: totalPendingAmt,
                    lastpaymentamount: lastPaidAmt,
                    lastpaymentdt: new Date(),
                    paymentcleardate: dtOfPaymentClearance
                };
                retVal = await this.GetLicPurchaseInstance(req);
            } else {
                retVal = null;
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }
}

export let LicenseUtilHandle = new LicenseUtilHandler();