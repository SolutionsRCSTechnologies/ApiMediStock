import { DBConfigEntity } from '../CommonModule/Entities';

class DataBaseConfig {
    private _mainDBUrl: string;
    private _mainDBName: string;

    public DBConfig: DBConfigEntity;

    constructor() {
        this._mainDBUrl = "mongodb://localhost:27017";
        this._mainDBName = "MediStockDB";
        this.DBConfig = new DBConfigEntity(this._mainDBName, this._mainDBUrl);
    }
}

export let DBConfig = new DataBaseConfig().DBConfig;

export const UserDBCollection = {
    ActiveSession: "ActiveSession",
    OrderDetail: "OrderDetail",
    OrderArchive: "OrderArchive",
    Notifications: "Notifications",
    SessionArchive: "SessionArchive",
    Products: "Products",
    Retailers: "Retailers",
    RetaileTransactions: "RetailTransactions",
    ProductsArchive: "ProductsArchive"
};

export const MainDBCollection = {
    Licenses: "Licenses",
    ActiveSession: "ActiveSession",
    Users: "Users",
    UserDetail: "UserDetail",
    LicenseTypes: "LicenseTypes",
    Registrations: "Registrations"
};