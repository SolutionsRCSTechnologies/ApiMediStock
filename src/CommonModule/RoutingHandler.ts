import { LoginHandle } from '../BusinessModule/AuthModule/Login/LoginHandler';
import { RegistrationHandle } from '../BusinessModule/AuthModule/Register/RegistrationHandler';
import { OrderHandle } from '../BusinessModule/OrderModule/OrderHandler';
import { Util } from './UtilHandler';
import { LicenseHandle } from '../BusinessModule/AuthModule/License/LicenseHandler';
import { MethodResponse } from './Entities';


enum APIMethodType {
    "GET", "POST"
};

class RoutingMethods {
    public async ActivateUser(reqData: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (await Util.ValidateRequestStructure(reqData)) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                retVal = await RegistrationHandle.ActivateUser(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }
    public async Login(reqData: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (await Util.ValidateRequestStructure(reqData)) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                retVal = await LoginHandle.Login(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }
    public async Logout(reqData: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (await Util.ValidateRequestStructure(reqData)) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                retVal = await LoginHandle.Logout(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }
    public async Register(reqData: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (reqData && reqData.header && reqData.body) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                retVal = await RegistrationHandle.Register(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }


    public async RegisterLicense(reqData: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (reqData && reqData.header && reqData.body) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                retVal = await LicenseHandle.RegisterLicense(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    public async GetAllUserIds(reqData: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (reqData) {
                let body: any = reqData.body;
                retVal = await RegistrationHandle.GetAllUserIds(body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    public async GetOrderList(reqData: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (await Util.ValidateRequestStructure(reqData)) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                retVal = await OrderHandle.GetOrderList(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        }
        catch (e) {
            throw e;
        }
        return retVal;
    }

    public async GetOrderDetail(reqData: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (await Util.ValidateRequestStructure(reqData)) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                retVal = await OrderHandle.GetOrderDetail(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    public async CreateOrder(reqData: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (await Util.ValidateRequestStructure(reqData)) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                retVal = await OrderHandle.CreateNewOrder(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    public async UpdateOrderStatus(reqData: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (await Util.ValidateRequestStructure(reqData)) {
                let header: any = reqData.header;
                let body: any = reqData.body;
                retVal = await OrderHandle.UpdateOrderStatus(header, body);
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request.';
            }
        } catch (e) {
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
        url: "/auth/logout",
        handler: new RoutingMethods().Logout,
        method: APIMethodType.POST,
        name: "Logout Api"
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
    },
    {
        url: '/auth/license/register',
        handler: new RoutingMethods().RegisterLicense,
        method: APIMethodType.POST,
        name: 'License registration Api'
    },
    {
        url: '/auth/register/ids',
        handler: new RoutingMethods().GetAllUserIds,
        method: APIMethodType.POST,
        name: 'Get all user ids'
    },
    {
        url: '/order/list',
        handler: new RoutingMethods().GetOrderList,
        method: APIMethodType.POST,
        name: 'Get order list'
    },
    {
        url: '/order/detail',
        handler: new RoutingMethods().GetOrderDetail,
        method: APIMethodType.POST,
        name: 'Get order detail'
    },
    {
        url: '/order/new',
        handler: new RoutingMethods().CreateOrder,
        method: APIMethodType.POST,
        name: 'Create new order'
    },
    {
        url: '/order/update/status',
        handler: new RoutingMethods().UpdateOrderStatus,
        method: APIMethodType.POST,
        name: 'Update order status'
    }
];


