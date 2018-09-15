import { LoginHandle } from '../BusinessModule/AuthModule/Login/LoginHandler';
import { RegistrationHandle } from '../BusinessModule/AuthModule/Register/RegistrationHandler';
import { OrderHandle } from '../BusinessModule/OrderModule/OrderHandler';
import { Util } from './UtilHandler';


enum APIMethodType {
    "GET","POST"
};

export const RoutingHandler = [
    // {
    //     url:"/",
    //     handler: Util.ShowEndPoints,
    //     method: APIMethodType.GET,
    //     name: "Show Endpoints"
    // },
    {
        url:"/order/list",
        handler: OrderHandle.GetOrderList,
        method: APIMethodType.POST,
        name: "Display Order List Api"
    },
    {
        url:"/auth/login",
        handler: LoginHandle.Login,
        method: APIMethodType.POST,
        name: "Login Api"

    },
    {
        url:"/auth/register",
        handler: RegistrationHandle.Register,
        method: APIMethodType.POST,
        name: "Registration Api"
    }
];


