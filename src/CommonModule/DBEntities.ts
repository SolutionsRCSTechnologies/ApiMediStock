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

export class OrderProgress {
    private orderownedby: string;
    private orderownedbyid: string;
    private orderstatus: string;
    private orderstatusnumber: number;
    private orderlaststatus: string;
    private orderstatuschangedbyid: string;
    private timestamp: Date = new Date();
    private ordersequence: number = 0;

    public get OrderStatusNumber(): number {
        return this.orderstatusnumber;
    }
    public set OrderStatusNumber(val: number) {
        this.orderstatusnumber = val;
    }
    public get OrderSequence(): number {
        return this.ordersequence;
    }
    public set OrderSequence(val: number) {
        this.ordersequence = val;
    }
    public get OrderOwnedBy(): string {
        return this.orderownedby;
    }
    public set OrderOwnedBy(val: string) {
        this.orderownedby = val;
    }
    public get OrderOwnedById(): string {
        return this.orderownedbyid;
    }
    public set OrderOwnedById(val: string) {
        this.orderownedbyid = val;
    }
    public get OrderStatus(): string {
        return this.orderstatus;
    }
    public set OrderStatus(val: string) {
        this.orderstatus = val;
    }
    public get OrderLastStatus(): string {
        return this.orderlaststatus;
    }
    public set OrderLastStatus(val: string) {
        this.orderlaststatus = val;
    }
    public get OrderStatusChangedById(): string {
        return this.orderstatuschangedbyid;
    }
    public set OrderStatusChangedById(val: string) {
        this.orderstatuschangedbyid = val;
    }
    public get TimeStamp(): Date {
        return this.timestamp;
    }
    public set TimeStamp(val: Date) {
        this.timestamp = val;
    }
}

export class OrderElement {
    private itemname: string;
    private inventoryid: string;
    private itemmrp: number;
    private sellprice: number;
    private itemdiscountpercentage: number;
    private totaldiscountamount: number;
    private itemcompanyname: string;
    private itemexpirydate: Date;
    private itemordersize: number;
    private itembillsize: number;
    private totalprice: number;
    private totaldiscountedprice: number;
    private applydiscount: string = 'Y';
    private itemexclude: string = 'N';

    public get ItemExclude(): string {
        return this.itemexclude;
    }
    public set ItemExclude(val: string) {
        this.itemexclude = val;
    }
    public get ItemBillSize(): number {
        return this.itembillsize;
    }
    public set ItemBillSize(val: number) {
        this.itembillsize = val;
    }
    public get ItemName(): string {
        return this.itemname;
    }
    public set ItemName(val: string) {
        this.itemname = val;
    }
    public get InventoryId(): string {
        return this.inventoryid;
    }
    public set InventoryId(val: string) {
        this.inventoryid = val;
    }
    public get ItemMrp(): number {
        return this.itemmrp;
    }
    public set ItemMrp(val: number) {
        this.itemmrp = val;
    }
    public get SellPrice(): number {
        return this.sellprice;
    }
    public set SellPrice(val: number) {
        this.sellprice = val;
    }
    public get ItemDiscountPercentage(): number {
        return this.itemdiscountpercentage;
    }
    public set ItemDiscountPercentage(val: number) {
        this.itemdiscountpercentage = val;
    }
    public get TotalDiscountAmount(): number {
        return this.totaldiscountamount;
    }
    public set TotalDiscountAmount(val: number) {
        this.totaldiscountamount = val;
    }
    public get ItemCompanyName(): string {
        return this.itemcompanyname;
    }
    public set ItemCompanyName(val: string) {
        this.itemcompanyname = val;
    }
    public get ItemExpiryDate(): Date {
        return this.itemexpirydate;
    }
    public set ItemExpiryDate(val: Date) {
        this.itemexpirydate = val;
    }
    public get ItemOrderSize(): number {
        return this.itemordersize;
    }
    public set ItemOrderSize(val: number) {
        this.itemordersize = val;
    }
    public get TotalPrice(): number {
        return this.totalprice;
    }
    public set TotalPrice(val: number) {
        this.totalprice = val;
    }
    public get TotalDiscountedPrice(): number {
        return this.totaldiscountedprice;
    }
    public set TotalDiscountedPrice(val: number) {
        this.totaldiscountedprice = val;
    }
    public get ApplyDiscount(): string {
        return this.applydiscount;
    }
    public set ApplyDiscount(val: string) {
        this.applydiscount = val;
    }
}

export class OrderItems {
    private items: OrderElement[];
    private totaldiscountedprice: number;
    private totalnormalprice: number;
    private discountpercentage: number;
    private discountamount: number;
    //private amountpayable: number;
    private amountpaid: number;
    private amountpending: number;
    private finalprice: number;
    private applyoveralldiscount: string;
    private itemsdelivered: OrderElement[];

    constructor() {
        this.items = [];
        this.itemsdelivered = [];
    }

    public get ApplyOverAllDiscount(): string {
        return this.applyoveralldiscount;
    }
    public set ApplyOverAllDiscount(val: string) {
        this.applyoveralldiscount = val;
    }
    public get AmountPending(): number {
        return this.amountpending;
    }
    public set AmountPending(val: number) {
        this.amountpending = val;
    }
    public get AmountPaid(): number {
        return this.amountpaid;
    }
    public set AmountPaid(val: number) {
        this.amountpaid = val;
    }
    // public get AmountPayable(): number {
    //     return this.amountpayable;
    // }
    // public set AmountPayable(val: number) {
    //     this.amountpayable = val;
    // }
    public get DiscountAmount(): number {
        return this.discountamount;
    }
    public set DiscountAmount(val: number) {
        this.discountamount = val;
    }
    public get DiscountPercentage(): number {
        return this.discountpercentage;
    }
    public set DiscountPercentage(val: number) {
        this.discountpercentage = val;
    }
    public get TotalDiscountedPrice(): number {
        return this.totaldiscountedprice;
    }
    public set TotalDiscountedPrice(val: number) {
        this.totaldiscountedprice = val;
    }
    public get TotalNormalPrice(): number {
        return this.totalnormalprice;
    }
    public set TotalNormalPrice(val: number) {
        this.totalnormalprice = val;
    }
    public get FinalPrice(): number {
        return this.finalprice;
    }
    public set FinalPrice(val: number) {
        this.finalprice = val;
    }
    public get Items(): OrderElement[] {
        return this.items;
    }
    public set Items(val: OrderElement[]) {
        this.items = val;
    }
    public get ItemsDelivered(): OrderElement[] {
        return this.itemsdelivered;
    }
    public set ItemsDelivered(val: OrderElement[]) {
        this.itemsdelivered = val;
    }
}

export class OrderDetail {
    private orderid: string;
    private _id: string;
    private orderownedby: string;
    private orderownedbyid: string;
    private orderstatus: string;
    private ordersumbitdate: Date = new Date();
    private orderdeliverydate: Date = new Date();
    private isactive: string = 'Y';
    private iscanceled: string = 'N';
    //private orderamount: number = 0;
    private retailername: string;
    private retailerid: string;
    private retailershopname: string;
    private retailercontactnumber: number;
    //private retailergeolocation: Geolocation;
    private ordercreatedbyid: string;
    private orderflow: OrderProgress[];
    private orderitems: OrderItems;
    private orderdelivereddate: Date = new Date();
    private orderdeliveredby: string;
    private createddate: Date = new Date();
    private updateddate: Date = new Date();
    private createdby: string = 'SYSTEM';
    private updatedby: string = 'SYSTEM';

    constructor() {
        Util.GetCustomGuidStr('ORD').then(res => {
            this._id = res;
            this.orderid = res;
        }).catch(err => { });
        this.orderitems = new OrderItems();
        this.orderflow = [];
        this.orderdelivereddate.setDate(this.orderdelivereddate.getDate() + 1);
    }

    public get UpdatedBy(): string {
        return this.updatedby;
    }
    public set UpdatedBy(val: string) {
        this.updatedby = val;
    }
    public get CreatedBy(): string {
        return this.createdby;
    }
    public set CreatedBy(val: string) {
        this.createdby = val;
    }
    public get UpdatedDate(): Date {
        return this.updateddate;
    }
    public set UpdatedDate(val: Date) {
        this.updateddate = val;
    }
    public get CreatedDate(): Date {
        return this.createddate;
    }
    public set CreatedDate(val: Date) {
        this.createddate = val;
    }
    public get OrderDeliveredBy(): string {
        return this.orderdeliveredby;
    }
    public set OrderDeliveredBy(val: string) {
        this.orderdeliveredby = val;
    }
    public get OrderDeliveredDate(): Date {
        return this.orderdelivereddate;
    }
    public set OrderDeliveredDate(val: Date) {
        this.orderdelivereddate = val;
    }
    public get OrderItems(): OrderItems {
        return this.orderitems;
    }
    public set OrderItems(val: OrderItems) {
        this.orderitems = val;
    }
    public get OrderFlow(): OrderProgress[] {
        return this.orderflow;
    }
    public set OrderFlow(val: OrderProgress[]) {
        this.orderflow = val;
    }
    public get OrderCreatedById(): string {
        return this.ordercreatedbyid;
    }
    public set OrderCreatedById(val: string) {
        this.ordercreatedbyid = val;
    }
    public get RetailerContactNumber(): number {
        return this.retailercontactnumber;
    }
    public set RetailerContactNumber(val: number) {
        this.retailercontactnumber = val;
    }
    public get RetailerShopName(): string {
        return this.retailershopname;
    }
    public set RetailerShopName(val: string) {
        this.retailershopname = val;
    }
    public get RetailerId(): string {
        return this.retailerid;
    }
    public set RetailerId(val: string) {
        this.retailerid = val;
    }
    public get RetailerName(): string {
        return this.retailername;
    }
    public set RetailerName(val: string) {
        this.retailername = val;
    }
    // public get OrderAmount(): number {
    //     return this.orderamount;
    // }
    // public set OrderAmount(val: number) {
    //     this.orderamount = val;
    // }
    public get IsCanceled(): string {
        return this.iscanceled;
    }
    public set IsCanceled(val: string) {
        this.iscanceled = val;
    }
    public get IsActive(): string {
        return this.isactive;
    }
    public set IsActive(val: string) {
        this.isactive = val;
    }
    public get OrderDeliveryDate(): Date {
        return this.orderdeliverydate;
    }
    public set OrderDeliveryDate(val: Date) {
        this.orderdeliverydate = val;
    }
    public get OrderSubmitDate(): Date {
        return this.ordersumbitdate;
    }
    public set OrderSubmitDate(val: Date) {
        this.ordersumbitdate = val;
    }
    public get OrderStatus(): string {
        return this.orderstatus;
    }
    public set OrderStatus(val: string) {
        this.orderstatus = val;
    }
    public get OrderId(): string {
        return this.orderid;
    }
    public set OrderId(val: string) {
        this.orderid = val;
    }
    public get OrderOwnedBy(): string {
        return this.orderownedby;
    }
    public set OrderOwnedBy(val: string) {
        this.orderownedby = val;
    }
    public get OrderOwnedById(): string {
        return this.orderownedbyid;
    }
    public set OrderOwnedById(val: string) {
        this.orderownedbyid = val;
    }
}

export class InventoryType {
    private _id: string;
    private invtypeid: string;
    private prodname: string;
    private companyname: string;
    private basecount: number;
    private status: string;
    private createddt: Date;
    private updateddt: Date;
    private createdby: string;
    private updatedby: string;

    public get Id(): string {
        return this._id;
    }
    public set Id(val: string) {
        this._id = val;
        this.invtypeid = val;
    }
    public get InvTypeId(): string {
        return this.invtypeid;
    }
    public set InvTypeId(val: string) {
        this._id = val;
        this.invtypeid = val;
    }

    public get Status(): string {
        return this.status;
    }
    public set Status(val: string) {
        this.status = val;
    }
    public get ProdName(): string {
        return this.prodname;
    }
    public set ProdName(val: string) {
        this.prodname = val;
    }
    public get CompanyName(): string {
        return this.companyname;
    }
    public set CompanyName(val: string) {
        this.companyname = val;
    }
    public get BaseCount(): number {
        return this.basecount;
    }
    public set BaseCount(val: number) {
        this.basecount = val;
    }
    public get UpdatedBy(): string {
        return this.updatedby;
    }
    public set UpdatedBy(val: string) {
        this.updatedby = val;
    }
    public get CreatedBy(): string {
        return this.createdby;
    }
    public set CreatedBy(val: string) {
        this.createdby = val;
    }
    public get UpdatedDt(): Date {
        return this.updateddt;
    }
    public set UpdatedDt(val: Date) {
        this.updateddt = val;
    }
    public get CreatedDt(): Date {
        return this.createddt;
    }
    public set CreatedDt(val: Date) {
        this.createddt = val;
    }
}

export class InventoryProdType {
    private _id: string;
    private invid: string;
    private productname: string;
    private prodtype: string;
    private prodspecification: string;
    private expirydate: Date;
    private count: number;
    private mrp: number;
    private sellprice: number;
    private discountpercentage: number;
    private createddt: Date;
    private updateddt: Date;
    private createdby: string;
    private updatedby: string;

    public get Id(): string {
        return this._id;
    }
    public set Id(val: string) {
        this._id = val;
        this.invid = val;
    }

    public get InvId(): string {
        return this.invid;
    }
    public set InvId(val: string) {
        this._id = val;
        this.invid = val;
    }

    public get UpdatedBy(): string {
        return this.updatedby;
    }
    public set UpdatedBy(val: string) {
        this.updatedby = val;
    }
    public get CreatedBy(): string {
        return this.createdby;
    }
    public set CreatedBy(val: string) {
        this.createdby = val;
    }
    public get UpdatedDt(): Date {
        return this.updateddt;
    }
    public set UpdatedDt(val: Date) {
        this.updateddt = val;
    }
    public get CreatedDt(): Date {
        return this.createddt;
    }
    public set CreatedDt(val: Date) {
        this.createddt = val;
    }
    public get DiscountPercentage(): number {
        return this.discountpercentage;
    }
    public set DiscountPercentage(val: number) {
        this.discountpercentage = val;
    }
    public get SellPrice(): number {
        return this.sellprice;
    }
    public set SellPrice(val: number) {
        this.sellprice = val;
    }
    public get MRP(): number {
        return this.mrp;
    }
    public set MRP(val: number) {
        this.mrp = val;
    }
    public get Count(): number {
        return this.count;
    }
    public set Count(val: number) {
        this.count = val;
    }
    public get ExpiryDate(): Date {
        return this.expirydate;
    }
    public set ExpiryDate(val: Date) {
        this.expirydate = val;
    }
    public get ProductSpecification(): string {
        return this.prodspecification;
    }
    public set ProductSpecification(val: string) {
        this.prodspecification = val;
    }
    public get ProductName(): string {
        return this.productname;
    }
    public set ProductName(val: string) {
        this.productname = val;
    }
    public get ProductType(): string {
        return this.prodtype;
    }
    public set ProductType(val: string) {
        this.prodtype = val;
    }
}

export class Retailer {
    private retailerid: string;
    private retailername: string;
    private retailershopname: string;
    private druglicense: string;
    private ownername: string;
    private retailercontactnumber: number;
    private ownerphonenumber: number;
    private address: string;
    private nearbylocation: string;
    private pincode: string;
    private city: string;
    private district: string;
    private maxpendingamount: number;

    public get MaxPendingAmount(): number {
        return this.maxpendingamount;
    }
    public set MaxPendingAmount(val: number) {
        this.maxpendingamount = val;
    }
    public get District(): string {
        return this.district;
    }
    public set District(val: string) {
        this.district = val;
    }
    public get City(): string {
        return this.city;
    }
    public set City(val: string) {
        this.city = val;
    }
    public get PINCode(): string {
        return this.pincode;
    }
    public set PINCode(val: string) {
        this.pincode = val;
    }
    public get NearByLocation(): string {
        return this.nearbylocation;
    }
    public set NearByLocation(val: string) {
        this.nearbylocation = val;
    }
    public get Address(): string {
        return this.address;
    }
    public set Address(val: string) {
        this.address = val;
    }
    public get OwnerPhoneNumber(): number {
        return this.ownerphonenumber;
    }
    public set OwnerPhoneNumber(val: number) {
        this.ownerphonenumber = val;
    }
    public get RetailerContactNumber(): number {
        return this.retailercontactnumber;
    }
    public set RetailerContactNumber(val: number) {
        this.retailercontactnumber = val;
    }
    public get OwnerName(): string {
        return this.ownername;
    }
    public set OwnerName(val: string) {
        this.ownername = val;
    }
    public get DrugLicense(): string {
        return this.druglicense;
    }
    public set DrugLicense(val: string) {
        this.druglicense = val;
    }
    public get RetailerId(): string {
        return this.retailerid;
    }
    public set RetailerId(val: string) {
        this.retailerid = val;
    }
    public get RetailerShopName(): string {
        return this.retailershopname;
    }
    public set RetailerShopName(val: string) {
        this.retailershopname = val;
    }
    public get RetailerName(): string {
        return this.retailername;
    }
    public set RetailerName(val: string) {
        this.retailername = val;
    }
}

export class OrderApproverLevels {
    private ordstatuslebelid: string;
    private statuslebel: string;
    private statuslebelnumber: number;
    private active: string;
    private approvers: string[];
    private frompromotestatuses: string[];
    private fromdemotestatuses: string[];

    public get FromDemoteStatuses(): string[] {
        return this.fromdemotestatuses;
    }
    public set FromDemoteStatuses(val: string[]) {
        this.fromdemotestatuses = val;
    }
    public get FromPromoteStatuses(): string[] {
        return this.frompromotestatuses;
    }
    public set FromPromoteStatuses(val: string[]) {
        this.frompromotestatuses = val;
    }
    public get OrdStatusLebelId(): string {
        return this.ordstatuslebelid;
    }
    public set OrdStatusLebelId(val: string) {
        this.ordstatuslebelid = val;
    }
    public get StatusLebel(): string {
        return this.statuslebel;
    }
    public set StatusLebel(val: string) {
        this.statuslebel = val;
    }
    public get StatusLebelNumber(): number {
        return this.statuslebelnumber;
    }
    public set StatusLebelNumber(val: number) {
        this.statuslebelnumber = val;
    }
    public get Active(): string {
        return this.active;
    }
    public set Active(val: string) {
        this.active = val;
    }
    public get Approvers(): string[] {
        return this.approvers;
    }
    public set Approvers(val: string[]) {
        this.approvers = val;
    }
}