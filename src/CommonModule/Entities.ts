

export class DBConfigEntity {
    private _MainDBName: string = "";
    private _MainDBUrl: string = "";
    private _UserDBName: string = "";
    private _UserDBUrl: string = "";

    constructor(_mainDBName: string, _mainDBUrl: string, _userDBUrl?: string) {
        this._MainDBName = _mainDBName;
        this._MainDBUrl = _mainDBUrl;
        if (_userDBUrl && _userDBUrl.length > 0) {
            this._UserDBUrl = _userDBUrl;
        } else {
            this._UserDBUrl = this._MainDBUrl;
        }
    }


    public get MainDBName(): string {
        return this._MainDBName;
    }
    // public set MainDBName(val){
    //     this._MainDBName = val;
    // }
    public get MainDBUrl(): string {
        return this._MainDBUrl;
    }
    // public set MainDBUrl(val){
    //     this._MainDBUrl = val;
    // }
    public get UserDBName(): string {
        return this._UserDBName;
    }
    public set UserDBName(val) {
        this._UserDBName = val;
    }
    public get UserDBUrl(): string {
        return this._UserDBUrl;
    }
    public set UserDBUrl(val) {
        this._UserDBUrl = val;
    }
}

export class RequestHeader {
    private _username: string;
    private _password: string;
    private _sessionid: string;

    public get UserName(): string {
        return this._username;
    }
    public set UserName(val) {
        this._username = val;
    }

    public get Password(): string {
        return this._password;
    }
    public set Password(val) {
        this._password = val;
    }

    public get SessionId(): string {
        return this._sessionid;
    }
    public set SessionId(val) {
        this._sessionid = val;
    }
}

export class RequestEntity {
    private _header: RequestHeader = new RequestHeader();
    private _body: any = null;

    public get Header(): RequestHeader {
        return this._header;
    }
    public set Header(val) {
        this._header = val;
    }
    public get Body(): any {
        return this._body;
    }
    public set Body(val) {
        this._body = val;
    }
}

export class ResponseHeader {
    private message: string;
    private errorcode: number;
    private sessionid: string;
    private elapsedto: Date = new Date();
    private username: string;
    private usertype: string;
    private userrole: string;

    constructor() {
        this.elapsedto.setDate(4);
    }

    public get UserRole(): string {
        return this.userrole;
    }
    public set UserRole(val) {
        this.userrole = val;
    }
    public get UserType(): string {
        return this.usertype;
    }
    public set UserType(val) {
        this.usertype = val;
    }
    public get UserName(): string {
        return this.username;
    }
    public set UserName(val) {
        this.username = val;
    }
    public get Message(): string {
        return this.message;
    }
    public set Message(val) {
        this.message = val;
    }
    public get SessionId(): string {
        return this.sessionid;
    }
    public set SessionId(val) {
        this.sessionid = val;
    }
    public get ErrorCode(): number {
        return this.errorcode;
    }
    public set ErrorCode(val) {
        this.errorcode = val;
    }
    public get ElapsedTo(): Date {
        return this.elapsedto;
    }
    public set ElapsedTo(val) {
        this.elapsedto = val;
    }
}

export class ResponseEntity {
    private header: ResponseHeader = null;
    private body: any = null;

    constructor() {
        this.header = new ResponseHeader();
    }

    public get Header(): ResponseHeader {
        return this.header;
    }
    public set Header(val) {
        this.header = val;
    }
    public get Body(): any {
        return this.body;
    }
    public set Body(val) {
        this.body = val;
    }
}

export class MethodResponse {
    private errorcode: number = 0;
    private message: string = '';
    private result: any = null;
    private elapsedto: Date = new Date();
    private sessionid: string = '';
    private username: string = '';
    private usertype: string = '';
    private userrole: string = '';


    public get UserRole(): string {
        return this.userrole;
    }
    public set UserRole(val) {
        this.userrole = val;
    }
    public get UserType(): string {
        return this.usertype;
    }
    public set UserType(val) {
        this.usertype = val;
    }
    public get UserName(): string {
        return this.username;
    }
    public set UserName(val) {
        this.username = val;
    }
    public get SessionId(): string {
        return this.sessionid;
    }
    public set SessionId(val) {
        this.sessionid = val;
    }
    public get ElapsedTo(): Date {
        return this.elapsedto;
    }
    public set ElapsedTo(val) {
        this.elapsedto = val;
    }
    public get ErrorCode(): number {
        return this.errorcode;
    }
    public set ErrorCode(val) {
        this.errorcode = val;
    }
    public get Message(): string {
        return this.message;
    }
    public set Message(val) {
        this.message = val;
    }
    public get Result(): any {
        return this.result;
    }
    public set Result(val) {
        this.result = val;
    }
}

export class DBConfiguaration {
    private userDBName: string = '';
    private userDBUrl: string = '';
    private mainDBName: string = '';
    private mainDBUrl: string = '';

    public get UserDBName(): string {
        return this.userDBName;
    }
    public set UserDBName(val: string) {
        this.userDBName = val;
    }
    public get UserDBUrl(): string {
        return this.userDBUrl;
    }
    public set UserDBUrl(val: string) {
        this.userDBUrl = val;
    }
    public get MainDBName(): string {
        return this.mainDBName;
    }
    public set MainDBName(val: string) {
        this.mainDBName = val;
    }
    public get MainDBUrl(): string {
        return this.mainDBUrl;
    }
    public set MainDBUrl(val: string) {
        this.mainDBUrl = val;
    }
}

export class SearchQueryProperties {
    private isOwner: boolean = false;
    private isAdmin: boolean = false;
    private isDateRange: boolean = false;
    private isFixedDate: boolean = false;
    private onlyActive: boolean = true;
    private isOwnedBy: boolean = false;
    private isRetailerSearch: boolean = false;
    private isDeliveryDate: boolean = false;
    private isDeliveryDateRange: boolean = false;
    private isAmount: boolean = false;

    private ordercreatedbyid: string = null;
    private orderownedbyid: string = null;
    private createddate: Date = new Date();
    private updateddate: Date = new Date();
    private retailerid: string = null;
    private retailername: string = null;
    private retailershopname: string = null;
    private isactive: string = null;
    private orderdeliverydate: Date = new Date();

    constructor() {
        // let curDate: Date = new Date();
        // let curDay: number = curDate.getDate();

        // this.createddate.setDate(curDay - 5);
        // this.updateddate.setDate(curDay - 5);
        // this.orderdeliverydate.setDate(curDay + 2);
    }

    public get OrderOwnedById(): string {
        return this.orderownedbyid;
    }
    public set OrderOwnedById(val: string) {
        this.orderownedbyid = val;
    }
    public get OrderCreatedById(): string {
        return this.ordercreatedbyid;
    }
    public set OrderCreatedById(val: string) {
        this.ordercreatedbyid = val;
    }
    public get IsAmount(): boolean {
        return this.isAmount;
    }
    public set IsAmount(val: boolean) {
        this.isAmount = val;
    }
    public get IsDeliveryDateRange(): boolean {
        return this.isDeliveryDateRange;
    }
    public set IsDeliveryDateRange(val: boolean) {
        this.isDeliveryDateRange = val;
    }
    public get IsDeliveryDate(): boolean {
        return this.isDeliveryDate;
    }
    public set IsDeliveryDate(val: boolean) {
        this.isDeliveryDate = val;
    }
    public get IsRetailerSearch(): boolean {
        return this.isRetailerSearch;
    }
    public set IsRetailerSearch(val: boolean) {
        this.isRetailerSearch = val;
    }
    public get IsOwnedBy(): boolean {
        return this.isOwnedBy;
    }
    public set IsOwnedBy(val: boolean) {
        this.isOwnedBy = val;
    }
    public get OnlyActive(): boolean {
        return this.onlyActive;
    }
    public set OnlyActive(val: boolean) {
        this.onlyActive = val;
    }
    public get IsOwner(): boolean {
        return this.isOwner;
    }
    public set IsOwner(val: boolean) {
        this.isOwner = val;
    }
    public get IsAdmin(): boolean {
        return this.isAdmin;
    }
    public set IsAdmin(val: boolean) {
        this.isAdmin = val;
    }

    public get IsDateRange(): boolean {
        return this.isDateRange;
    }
    public set IsDateRange(val: boolean) {
        this.isDateRange = val;
    }
    public get IsFixedDate(): boolean {
        return this.isFixedDate;
    }
    public set IsFixedDate(val: boolean) {
        this.isFixedDate = val;
    }
}

// export class OrderSearchCriteria {
//     private ordercreatedbyid: string = null;
//     private orderownedbyid: string = null;
//     private createddate: Date = new Date();
//     private updateddate: Date = new Date();
//     private retailerid: string = null;
//     private retailername: string = null;
//     private retailershopname: string = null;
//     private isactive: string = null;
//     private orderdeliverydate: Date = new Date();

//     constructor() {
//         let curDate: Date = new Date();
//         let curDay: number = curDate.getDate();

//         this.createddate.setDate(curDay - 5);
//         this.updateddate.setDate(curDay - 5);
//         this.orderdeliverydate.setDate(curDay + 2);
//     }
// }