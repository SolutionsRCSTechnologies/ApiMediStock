
export class DBConfigEntity{
    private _MainDBName:string = "";
    private _MainDBUrl:string = "";
    private _UserDBName:string = "";
    private _UserDBUrl:string = "";

    constructor(_mainDBName:string, _mainDBUrl:string){
        this._MainDBName = _mainDBName;
        this._MainDBUrl = _mainDBUrl;
    }


    public get MainDBName():string{
        return this._MainDBName;
    }
    // public set MainDBName(val){
    //     this._MainDBName = val;
    // }
    public get MainDBUrl():string{
        return this._MainDBUrl;
    }
    // public set MainDBUrl(val){
    //     this._MainDBUrl = val;
    // }
    public get UserDBName():string{
        return this._UserDBName;
    }
    public set UserDBName(val){
        this._UserDBName = val;
    }
    public get UserDBUrl():string{
        return this._UserDBUrl;
    }
    public set UserDBUrl(val){
        this._UserDBUrl = val;
    }
}