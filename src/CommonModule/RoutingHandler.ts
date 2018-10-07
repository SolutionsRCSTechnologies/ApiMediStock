import { LoginHandle } from '../BusinessModule/AuthModule/Login/LoginHandler';
import { RegistrationHandle } from '../BusinessModule/AuthModule/Register/RegistrationHandler';
import { OrderHandle } from '../BusinessModule/OrderModule/OrderHandler';
import { inventoryHandle} from '../BusinessModule/InventoryModule/InventoryHandler';
import { Util } from './UtilHandler';


enum APIMethodType {
    "GET","POST","DELETE"
};

class RoutingMethods{
    public async Login(reqData:any){
        let retVal:any;
        try{
            retVal = await LoginHandle.Login(reqData);
        }
        catch(e){
            throw e;
        }
        return retVal;
    }
    public async Register(reqData:any){
        let retVal:any;
        try{
            retVal = await RegistrationHandle.Register(reqData);
        }
        catch(e){
            throw e;
        }
        return retVal;
    }

    public async GetOrderList(reqData:any){
        let retVal:any;
        try{
            retVal = await OrderHandle.GetOrderList(reqData);
        }
        catch(e){
            throw e;
        }
        return retVal;
    }

    public async inventorytypeadd(reqData:any){
        let retVal:any;
        try{
            retVal = await inventoryHandle.SetInventoryTypeList(reqData);
        }
        catch(e){
            throw e;
        }
        return retVal;        
    }

    public async AddUpdateInventorytype(reqData:any[]){
        console.log(100);
        let retVal:any;
        try{
            retVal = await inventoryHandle.AddUpdateInventorytype(reqData);
        }
        catch(e){
            throw e;
        }
        return retVal;        
    }

    public async inventorytypedelete(productNameobj:any){
        let retVal:any;
        try{
            retVal = await inventoryHandle.deleteInventoryTypeList(productNameobj);
        }
        catch(e){
            throw e;
        }
        return retVal;        
    }

    public async inventorytypelist(listObj:any){
        let retVal:any;
        try{
            retVal = await inventoryHandle.GetInventoryTypeList(listObj);
        }
        catch(e){
            throw e;
        }
        return retVal;        
    }

    public async InventoryTypeget(reqData:any){
        let retVal:any;
        try{
            retVal = await inventoryHandle.InventoryTypeget(reqData);
        }
        catch(e){
            throw e;
        }
        return retVal;
    }
    
}

export const RoutingHandler = [
    // {
    //     url:"/",
    //     handler: Util.ShowEndPoints,
    //     method: APIMethodType.GET,
    //     name: "Show Endpoints"
    // },
    {
        url:"/order/list",
        handler: new RoutingMethods().GetOrderList,
        method: APIMethodType.POST,
        name: "Display Order List Api"
    },
    {
        url:"/auth/login",
        handler: new RoutingMethods().Login,
        method: APIMethodType.POST,
        name: "Login Api"

    },
    {
        url:"/auth/register",
        handler: new RoutingMethods().Register,
        method: APIMethodType.POST,
        name: "Registration Api"
    },
    {
        url:"/inventory/type/add",
        handler: new RoutingMethods().inventorytypeadd,
        method: APIMethodType.POST,
        name: "Inventory Type Add Api"
    },
    {
        url:"/inventory/type/delete",
        handler: new RoutingMethods().inventorytypedelete,
        method: APIMethodType.POST,
        name: "Inventory Type Delete Api"
    },
    {
        url:"/inventory/type/list",
        handler: new RoutingMethods().inventorytypelist,
        method: APIMethodType.POST,
        name: "Inventory Type List Api"
    },
    {
        url:"/inventory/type/addupdate",
        handler: new RoutingMethods().AddUpdateInventorytype,
        method: APIMethodType.POST,
        name: "Inventory Type Add/Update Api"
    },
    {
        url:"/inventory/type/get",
        handler: new RoutingMethods().InventoryTypeget,
        method: APIMethodType.POST,
        name: "Inventory Type Get Api"
    }
];


