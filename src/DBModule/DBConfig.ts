import { DBConfigEntity } from '../CommonModule/Entities';

class DataBaseConfig {
    private _mainDBUrl: string;
    private _mainDBName: string;

    public DBConfig: DBConfigEntity;

    constructor() {
        this._mainDBUrl = "mongodb://localhost:27017";
        //this._mainDBUrl = "mongodb://localhost:27015";
        this._mainDBName = "MediStockDB";
        this.DBConfig = new DBConfigEntity(this._mainDBName, this._mainDBUrl);
    }
}

export let DBConfig = new DataBaseConfig().DBConfig;

export const UserDBCollection = {
    //ActiveSession: "ActiveSession",
    OrderDetail: "OrderDetail",
    OrderArchive: "OrderArchive",
    Notifications: "Notifications",
    SessionArchive: "SessionArchive",
    Products: "Products",
    Retailers: "Retailers",
    RetaileTransactions: "RetailTransactions",
    ProductsArchive: "ProductsArchive",
    CollectionsStatus: "CollectionsStatus"
};

export const MainDBCollection = {
    Licenses: "Licenses",
    ActiveSession: "ActiveSession",
    Users: "Users",
    LicenseTypes: "LicenseTypes",
    Registrations: "Registrations",
    PaymentDetails: "PaymentDetails",
    LicensePurchase: "LicensePurchase",
    UserDBCollection: "UserDBCollection"
};

export const UserDBCollectionArr = [
    "CollectionsStatus",
    "ProductsArchive",
    "RetailTransactions",
    "Retailers",
    "Products",
    "Notifications",
    "SessionArchive",
    "OrderArchive",
    "OrderDetail"
];