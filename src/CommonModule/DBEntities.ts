import { Long, Double } from 'bson';
import { Util } from './UtilHandler';
import * as moment from 'moment';

export class LicenseType {
    private typeid: string;
    private lictype: string;
    private licprice: string;

    public get TypeId(): string {
        return this.typeid;
    }
    public set TypeId(val) {
        this.typeid = val;
    }
    public get LicenseType(): string {
        return this.lictype;
    }
    public set LicenseType(val) {
        this.lictype = val;
    }
    public get LicensePrice(): string {
        return this.licprice;
    }
    public set LicensePrice(val) {
        this.licprice = val;
    }
}

export class LicenseDetail {
    private _id: string;
    private licid: string;
    private lictype: string;
    private ownerid: string;
    private maxuser: number;
    private userdb: string;
    private userdburl: string;
    private dbcreated: string = 'N';
    private licstartdate: Date = new Date();
    private licenddate: Date = new Date();
    private isamountpending: string = 'Y';
    //private licpurcrefid: string;
    private active: string;
    private createdat: Date = new Date();
    private createdby: string;
    private updatedat: Date = new Date();
    private updatedby: string;

    constructor() {
        Util.GetCustomGuidStr("LIC").then(res => {
            if (res) {
                this._id = res;
                this.licid = res;
            }
        }).catch(err => {
            throw err;
        });
    }

    public get IsAmountPending(): string {
        return this.isamountpending;
    }
    public set IsAmountPending(val) {
        this.isamountpending = val;
    }
    public get DBCreated(): string {
        return this.dbcreated;
    }
    public set DBCreated(val) {
        this.dbcreated = val;
    }
    public get OwnerId(): string {
        return this.ownerid;
    }
    public set OwnerId(val) {
        this.ownerid = val;
    }
    public get CreatedAt(): Date {
        return this.createdat;
    }
    public set CreatedAt(val) {
        this.createdat = val;
    }
    public get CreatedBy(): string {
        return this.createdby;
    }
    public set CreatedBy(val) {
        this.createdby = val;
    }
    public get UpdatedAt(): Date {
        return this.updatedat;
    }
    public set UpdatedAt(val) {
        this.updatedat = val;
    }
    public get UpdatedBy(): string {
        return this.updatedby;
    }
    public set UpdatedBy(val) {
        this.updatedby = val;
    }
    public get LicEndDate(): Date {
        return this.licenddate;
    }
    public set LicEndDate(val) {
        this.licenddate = val;
    }
    public get Active(): string {
        return this.active;
    }
    public set Active(val) {
        this.active = val;
    }
    public get UserDB(): string {
        return this.userdb;
    }
    public set UserDB(val) {
        this.userdb = val;
    }
    public get UserDBUrl(): string {
        return this.userdburl;
    }
    public set UserDBUrl(val) {
        this.userdburl = val;
    }
    public get LicStartDate(): Date {
        return this.licstartdate;
    }
    public set LicStartDate(val) {
        this.licstartdate = val;
    }
    public get MaxUsers(): number {
        return this.maxuser;
    }
    public set MaxUsers(val) {
        this.maxuser = val;
    }
    public get LicType(): string {
        return this.lictype;
    }
    public set LicType(val) {
        this.lictype = val;
    }
    public get LicId(): string {
        return this.licid;
    }
    public set LicId(val) {
        this.licid = val;
    }
}

export class LicensePurchase {
    private _id: string;
    private licpurid: string;
    private licid: string;
    private subscriptiontype: string;
    private subscriptionlength: number;
    private lictype: string;
    //private paymentoption: string;
    //private monthlyprice: Double;
    //private yearlyprice: Double;
    //private monthlypayableprice: Double;
    private totalprice: number;
    private discountpercentage: number = 0.0;
    private discountamount: number = 0.0;
    private applydiscountpercentage: string = 'N';
    private applydiscountamount: string = 'N';
    private lastpaymentamount: number = 0.0;
    private lastpaymentdt: Date = new Date(2000, 1, 1);
    private totalpaidamount: number = 0.0;
    private totalpendingamount: number = 0.0;
    private totalpayableamount: number = 0.0;
    private totaldiscountamount: number = 0.0;
    private paymentcleardate: Date = null;
    //private currentpendingyearlyamount: Double = 0.0;
    //private missedpaymentcyclecount: number = 0;
    private ownerid: string;
    private createdat: Date = new Date();
    private updatedat: Date = new Date();
    private createdby: string = 'SYSTEM';
    private updatedby: string = 'SYSTEM';
    private active: string = 'Y';

    constructor(licId?: string, licType?: string) {
        Util.GetCustomGuidStr("LICPURC").then(res => {
            if (res) {
                this._id = res;
                this.licpurid = res;
            }
        }).catch(err => {
            throw err;
        });
        if (licId && licId.length > 0) {
            this.licid = licId;
        }
        if (licType && licType.length > 0) {
            this.lictype = licType;
        }
    }

    public get PaymentClearDate(): Date {
        return this.paymentcleardate;
    }
    public set PaymentClearDate(val) {
        this.paymentcleardate = val;
    }
    public get TotalDiscountAmount(): number {
        return this.totaldiscountamount;
    }
    public set TotalDiscountAmount(val) {
        this.totaldiscountamount = val;
    }
    public get TotalPayableAmount(): number {
        return this.totalpayableamount;
    }
    public set TotalPayableAmount(val) {
        this.totalpayableamount = val;
    }
    public get Active(): string {
        return this.active;
    }
    public set Active(val) {
        this.active = val;
    }
    public get LicPurId(): string {
        return this.licpurid;
    }
    public get TotalPendingAmount(): number {
        return this.totalpendingamount;
    }
    public set TotalPendingAmount(val) {
        this.totalpendingamount = val;
    }
    // public get CurrentPendingMonthlyAmount(): Double {
    //     return this.currentpendingmonthlyamount;
    // }
    // public set CurrentPendingMonthlyAmount(val) {
    //     this.currentpendingmonthlyamount = val;
    // }
    // public get CurrentPendingYearlyAmount(): Double {
    //     return this.currentpendingyearlyamount;
    // }
    // public set CurrentPendingYearlyAmount(val) {
    //     this.currentpendingyearlyamount = val;
    // }
    // public get MissedPaymentCycleCount(): number {
    //     return this.missedpaymentcyclecount;
    // }
    // public set MissedPaymentCycleCount(val) {
    //     this.missedpaymentcyclecount = val;
    // }
    public get OwnerId(): string {
        return this.ownerid;
    }
    public set OwnerId(val) {
        this.ownerid = val;
    }
    public get UpdatedBy(): string {
        return this.updatedby;
    }
    public set UpdatedBy(val) {
        this.updatedby = val;
    }
    public get CreatedAt(): Date {
        return this.createdat;
    }
    public set CreatedAt(val) {
        this.createdat = val;
    }
    public get UpdatedAt(): Date {
        return this.updatedat;
    }
    public set UpdatedAt(val) {
        this.updatedat = val;
    }
    public get CreatedBy(): string {
        return this.createdby;
    }
    public set CreatedBy(val) {
        this.createdby = val;
    }
    public get TotalPrice(): number {
        return this.totalprice;
    }
    public set TotalPrice(val) {
        this.totalprice = val;
    }
    public get DiscountPercentage(): number {
        return this.discountpercentage;
    }
    public set DiscountPercentage(val) {
        this.discountpercentage = val;
    }
    public get DiscountAmount(): number {
        return this.discountamount;
    }
    public set DiscountAmount(val) {
        this.discountamount = val;
    }
    public get ApplyDiscountPercentage(): string {
        return this.applydiscountpercentage;
    }
    public set ApplyDiscountPercentage(val) {
        this.applydiscountpercentage = val;
    }
    public get ApplyDiscountAmount(): string {
        return this.applydiscountamount;
    }
    public set ApplyDiscountAmount(val) {
        this.applydiscountamount = val;
    }
    public get LastPaymentAmount(): number {
        return this.lastpaymentamount;
    }
    public set LastPaymentAmount(val) {
        this.lastpaymentamount = val;
    }
    public get LastPaymentDt(): Date {
        return this.lastpaymentdt;
    }
    public set LastPaymentDt(val) {
        this.lastpaymentdt = val;
    }
    public get TotalPaidAmount(): number {
        return this.totalpaidamount;
    }
    public set TotalPaidAmount(val) {
        this.totalpaidamount = val;
    }
    // public get MonthlyPayablePrice(): Double {
    //     return this.monthlypayableprice;
    // }
    // public set MonthlyPayablePrice(val) {
    //     this.monthlypayableprice = val;
    // }
    // public get YearlyPrice(): Double {
    //     return this.yearlyprice;
    // }
    // public set YearlyPrice(val) {
    //     this.yearlyprice = val;
    // }
    // public get MonthlyPrice(): Double {
    //     return this.monthlyprice;
    // }
    // public set MonthlyPrice(val) {
    //     this.monthlyprice = val;
    // }
    // public get PaymentOption(): string {
    //     return this.paymentoption;
    // }
    // public set PaymentOption(val) {
    //     this.paymentoption = val;
    // }
    public get LicType(): string {
        return this.lictype;
    }
    public set LicType(val) {
        this.lictype = val;
    }
    public get SubscriptionLength(): number {
        return this.subscriptionlength;
    }
    public set SubscriptionLength(val) {
        this.subscriptionlength = val;
    }
    public get LicId(): string {
        return this.licid;
    }
    public set LicId(val) {
        this.licid = val;
    }
    public get SubscriptionType(): string {
        return this.subscriptiontype;
    }
    public set SubscriptionType(val) {
        this.subscriptiontype = val;
    }
}

export class User {
    private personid: string;
    private firstname: string;
    private middlename: string;
    private lastname: string;
    private userid: string;
    private password: string;
    private address: string;
    private active: string;
    private createdat: Date;
    private createdby: string;
    private updatedat: Date;
    private updatedby: string;
    private mobileno: Int16Array;
    private usertype: string;
    private licensed: string;
    private ownerrefid: string;
    private emailid: string;
    private _id: string;

    constructor(isOwner: boolean) {
        let cusStr: string = 'US';
        if (isOwner) {
            cusStr = 'UO';
        }
        Util.GetCustomGuidStr(cusStr).then(val => {
            if (val) {
                this.personid = val;
                this._id = val;
            }
        })
    }

    public get EmailId(): string {
        return this.emailid;
    }
    public set EmailId(val) {
        this.emailid = val;
    }
    public get OwnerRefId(): string {
        return this.ownerrefid;
    }
    public set OwnerRefId(val) {
        this.ownerrefid = val;
    }
    public get Licensed(): string {
        return this.licensed;
    }
    public set Licensed(val) {
        this.licensed = val;
    }
    public get UserType(): string {
        return this.usertype;
    }
    public set UserType(val) {
        this.usertype = val;
    }
    public get MobileNo(): Int16Array {
        return this.mobileno;
    }
    public set MobileNo(val) {
        this.mobileno = val;
    }
    public get PersonId(): string {
        return this.personid;
    }
    // public set PersonId(val) {
    //     this.personid = val;
    // }
    public get FirstName(): string {
        return this.firstname;
    }
    public set FirstName(val) {
        this.firstname = val;
    }
    public get MiddleName(): string {
        return this.middlename;
    }
    public set MiddleName(val) {
        this.middlename = val;
    }
    public get Password(): string {
        return this.password;
    }
    public set Password(val) {
        this.password = val;
    }
    public get UserId(): string {
        return this.userid;
    }
    public set UserId(val) {
        this.userid = val;
    }
    public get LastName(): string {
        return this.lastname;
    }
    public set LastName(val) {
        this.lastname = val;
    }
    public get Active(): string {
        return this.active;
    }
    public set Active(val) {
        this.active = val;
    }
    public get Address(): string {
        return this.address;
    }
    public set Address(val) {
        this.address = val;
    }
    public get UpdatedBy(): string {
        return this.updatedby;
    }
    public set UpdatedBy(val) {
        this.updatedby = val;
    }
    public get UpdatedAt(): Date {
        return this.updatedat;
    }
    public set UpdatedAt(val) {
        this.updatedat = val;
    }
    public get CreatedBy(): string {
        return this.createdby;
    }
    public set CreatedBy(val) {
        this.createdby = val;
    }
    public get CreatedAt(): Date {
        return this.createdat;
    }
    public set CreatedAt(val) {
        this.createdat = val;
    }
}

export class RegistrationDetail {
    private regid: string;
    private licid: string;
    private ownerid: string;
    private firstname: string;
    private lastname: string;
    private middlename: string;
    private maxusercount: Long;
    private mobileno: Int16Array;
    //private country: string;
    private address: string;
    private druglicense: string;
    private shopname: string;
    private active: string;
    private users: string[];
    private shopnumber: string;
    private ownerrefid: string;
    private emailid: string;
    private _id: string;
    private createdat: Date;
    private createdby: string;
    private updatedat: Date;
    private updatedby: string;
    private licensed: string;
    private userdbname: string;
    private userdburl: string;
    //private isdbcreated: string;
    private collectioncreated: string;

    constructor() {
        Util.GetCustomGuidStr('REG').then(val => {
            if (val) {
                this.regid = val;
                this._id = val;
            }
        }).catch(err => {
            throw err;
        });
    }

    // public get IsDBCreated(): string {
    //     return this.isdbcreated;
    // }
    // public set IsDBCreated(val) {
    //     this.isdbcreated = val;
    // }
    public get CollectionCreated(): string {
        return this.collectioncreated;
    }
    public set CollectionCreated(val) {
        this.collectioncreated = val;
    }
    public get UserDBName(): string {
        return this.userdbname;
    }
    public set UserDBName(val) {
        this.userdbname = val;
    }
    public get UserDBUrl(): string {
        return this.userdburl;
    }
    public set UserDBUrl(val) {
        this.userdburl = val;
    }
    public get Licensed(): string {
        return this.licensed;
    }
    public set Licensed(val) {
        this.licensed = val;
    }
    public get UpdatedAt(): Date {
        return this.updatedat;
    }
    public set UpdatedAt(val) {
        this.updatedat = val;
    }
    public get UpdatedBy(): string {
        return this.updatedby;
    }
    public set UpdatedBy(val) {
        this.updatedby = val;
    }
    public get CreatedAt(): Date {
        return this.createdat;
    }
    public set CreatedAt(val) {
        this.createdat = val;
    }
    public get CreatedBy(): string {
        return this.createdby;
    }
    public set CreatedBy(val) {
        this.createdby = val;
    }
    public get EmailId(): string {
        return this.emailid;
    }
    public set EmailId(val) {
        this.emailid = val;
    }
    public get OwnerRefId(): string {
        return this.ownerrefid;
    }
    public set OwnerRefId(val) {
        this.ownerrefid = val;
    }
    public get ShopNumber(): string {
        return this.shopnumber;
    }
    public set ShopNumber(val) {
        this.shopnumber = val;
    }
    public get Active(): string {
        return this.active;
    }
    public set Active(val) {
        this.active = val;
    }
    public get Users(): string[] {
        return this.users;
    }
    public set Users(val) {
        this.users = val;
    }
    // public get Country(): string {
    //     return this.country;
    // }
    // public set Country(val) {
    //     this.country = val;
    // }
    public get Address(): string {
        return this.address;
    }
    public set Address(val) {
        this.address = val;
    }
    public get DrugLicense(): string {
        return this.druglicense;
    }
    public set DrugLicense(val) {
        this.druglicense = val;
    }
    public get ShopName(): string {
        return this.shopname;
    }
    public set ShopName(val) {
        this.shopname = val;
    }
    public get LastName(): string {
        return this.lastname;
    }
    public set LastName(val) {
        this.lastname = val;
    }
    public get MiddleName(): string {
        return this.middlename;
    }
    public set MiddleName(val) {
        this.middlename = val;
    }
    public get MaxUserCount(): Long {
        return this.maxusercount;
    }
    public set MaxUserCount(val) {
        this.maxusercount = val;
    }
    public get MobileNo(): Int16Array {
        return this.mobileno;
    }
    public set MobileNo(val) {
        this.mobileno = val;
    }
    public get OwnerId(): string {
        return this.ownerid;
    }
    public set OwnerId(val) {
        this.ownerid = val;
    }
    public get FirstName(): string {
        return this.firstname;
    }
    public set FirstName(val) {
        this.firstname = val;
    }
    public get LicId(): string {
        return this.licid;
    }
    public set LicId(val) {
        this.licid = val;
    }
    public get RegId(): string {
        return this.regid;
    }
    // public set RegId(val) {
    //     this.regid = val;
    // }
}

export class ActiveSession {
    private userid: string;
    private sessionid: string;
    private starttime: Date;
    private endtime: Date;
    private userdb: string;
    private userdburl: string;
    private createdat: Date;
    private updatedat: Date;
    private createdby: string;
    private updatedby: string;
    private usertype: string;
    private _id: string;
    private username: string;
    private ownerrefid: string;
    private active: string;
    private userrole: string;

    constructor() {
        let timestr = new Date().getMilliseconds().toPrecision(5);
        Util.GetCustomGuidStr('SESSION', timestr).then(str => {
            this._id = str;
            this.sessionid = str;
            this.active = 'Y';
        }).catch(err => {
            throw err;
        });
    }

    public get UserRole(): string {
        return this.userrole;
    }
    public set UserRole(val) {
        this.userrole = val;
    }
    public get Active(): string {
        return this.active;
    }
    // public set Active(val) {
    //     this.active = val;
    // }
    public get OwnerRefId(): string {
        return this.ownerrefid;
    }
    public set OwnerRefId(val) {
        this.ownerrefid = val;
    }
    public get UserName(): string {
        return this.username;
    }
    public set UserName(val) {
        this.username = val;
    }
    public get UserType(): string {
        return this.usertype;
    }
    public set UserType(val) {
        this.usertype = val;
    }
    public get UpdatedBy(): string {
        return this.updatedby;
    }
    public set UpdatedBy(val) {
        this.updatedby = val;
    }
    public get UserDB(): string {
        return this.userdb;
    }
    public set UserDB(val) {
        this.userdb = val;
    }
    public get UserDBUrl(): string {
        return this.userdburl;
    }
    public set UserDBUrl(val) {
        this.userdburl = val;
    }
    public get CreatedBy(): string {
        return this.createdby;
    }
    public set CreatedBy(val) {
        this.createdby = val;
    }
    public get CreatedAt(): Date {
        return this.createdat;
    }
    public set CreatedAt(val) {
        this.createdat = val;
    }
    public get UpdatedAt(): Date {
        return this.updatedat;
    }
    public set UpdatedAt(val) {
        this.updatedat = val;
    }
    public get UserId(): string {
        return this.userid;
    }
    public set UserId(val) {
        this.userid = val;
    }
    public get SessionId(): string {
        return this.sessionid;
    }
    public set SessionId(val) {
        this.sessionid = val;
    }
    public get StartTime(): Date {
        return this.starttime;
    }
    public set StartTime(val) {
        this.starttime = val;
    }
    public get EndTime(): Date {
        return this.endtime;
    }
    public set EndTime(val) {
        this.endtime = val;
    }

}