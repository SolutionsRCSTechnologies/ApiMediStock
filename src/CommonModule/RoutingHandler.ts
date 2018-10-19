import { LoginHandle } from '../BusinessModule/AuthModule/Login/LoginHandler';
import { RegistrationHandle } from '../BusinessModule/AuthModule/Register/RegistrationHandler';
import { OrderHandle } from '../BusinessModule/OrderModule/OrderHandler';
import { Util } from './UtilHandler';


enum APIMethodType {
    "GET", "POST"
};

class RoutingMethods {
    public async ActivateUser(reqData: any) {
        let retVal: any;
        try {
            retVal = await RegistrationHandle.ActivateUser(reqData);
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }
    public async Login(reqData: any) {
        let retVal: any;
        try {
            retVal = await LoginHandle.Login(reqData);
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }
    public async Register(reqData: any) {
        let retVal: any;
        try {
            retVal = await RegistrationHandle.Register(reqData);
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }
    public async GetOrderList(reqData: any) {
        let retVal: any;
        try {
            retVal = await OrderHandle.GetOrderList(reqData);
        }
        catch (e) {
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
        url: "/order/list",
        handler: new RoutingMethods().GetOrderList,
        method: APIMethodType.POST,
        name: "Display Order List Api"
    },
    {
        url: "/auth/login",
        handler: new RoutingMethods().Login,
        method: APIMethodType.POST,
        name: "Login Api"

    },
    {
        url: "/auth/register",
        handler: new RoutingMethods().Register,
        method: APIMethodType.POST,
        name: "Registration Api"
    },
    {
        url: "/auth/activateuser",
        handler: new RoutingMethods().ActivateUser,
        method: APIMethodType.POST,
        name: "Registration Api"
    }
];


