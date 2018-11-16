import { Long, Double } from 'bson';
import { Util } from './UtilHandler';

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
    private licstartdate: Date = new Date();
    private licenddate: Date = new Date();
    private licpurcrefid: string;
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

    public get LicPurchaseRefId(): string {
        return this.licpurcrefid;
    }
    public set LicPurchaseRefId(val) {
        this.licpurcrefid = val;
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
    private subscriptionlength: Long;
    private lictype: string;
    private paymentoption: string;
    private monthlyprice: Double;
    private yearlyprice: Double;
    private monthlypayableprice: Double;
    private yearlypayableprice: Double;
    private discountpercentage: Double = 0.0;
    private discountamount: Double = 0.0;
    private applydiscountpercentage: string = 'N';
    private applydiscountamount: string = 'N';
    private lastpaymentamount: Double = 0.0;
    private lastpaymentdt: Date = new Date(2000, 1, 1);
    private totalpaidamount: Double = 0.0;
    private totalpendingamount: Double;
    private currentpendingmonthlyamount: Double = 0.0;
    private currentpendingyearlyamount: Double = 0.0;
    private missedpaymentcyclecount: number = 0;
    private ownerid: string;
    private createdat: Date = new Date();
    private updatedat: Date = new Date();
    private createdby: string = 'SYSTEM';
    private updatedby: string = 'SYSTEM';

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

    private get LicId(): string {
        return this.licid;
    }
    private set LicId(val) {
        this.licid = val;
    }
    private get SubscriptionType(): string {
        return this.subscriptiontype;
    }
    private set SubscriptionType(val) {
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
    private ownerfirstname: string;
    private ownerlastname: string;
    private ownermiddlename: string;
    private maxusercount: Long;
    private mobileno: Int16Array;
    private country: string;
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
    private createcollectionstat: string;

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

    public get CreateCollectionStat(): string {
        return this.createcollectionstat;
    }
    public set CreateCollectionStat(val) {
        this.createcollectionstat = val;
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
    public get Country(): string {
        return this.country;
    }
    public set Country(val) {
        this.country = val;
    }
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
    public get OwnerLastName(): string {
        return this.ownerlastname;
    }
    public set OwnerLastName(val) {
        this.ownerlastname = val;
    }
    public get OwnerMiddleName(): string {
        return this.ownermiddlename;
    }
    public set OwnerMiddleName(val) {
        this.ownermiddlename = val;
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
    public get OwnerFirstName(): string {
        return this.ownerfirstname;
    }
    public set OwnerFirstName(val) {
        this.ownerfirstname = val;
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

    constructor() {
        let timestr = new Date().toTimeString();
        Util.GetCustomGuidStr('SESSION', timestr).then(str => {
            this._id = str;
            this.sessionid = str;
            this.active = 'Y';
        }).catch(err => {
            throw err;
        });
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