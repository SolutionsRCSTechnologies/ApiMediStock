import { RegistrationDetail, User } from '../../CommonModule/DBEntities';
import { OrderUtilHandle } from "./OrderUtilHandler";
import { Util } from '../../CommonModule/UtilHandler';
import { OrderDBHandle } from './OrderDBHandler';
import { MethodResponse, DBConfiguaration, SearchQueryProperties } from '../../CommonModule/Entities';
import { LoginHandle } from '../AuthModule/Login/LoginHandler';

class OrderOpHandler {

    /*********Start of Api Methods***********/
    async GetOrderList(header: any, body: any) {
        let retVal: MethodResponse = new MethodResponse();
        let output: MethodResponse = null;
        let config: DBConfiguaration = null;
        let props: SearchQueryProperties = null;
        try {
            if (await OrderUtilHandle.ValidateOrderDetailsRequest(body)) {
                //Validate header
                output = await LoginHandle.ValidateHeader(header);
                if (output && output.ErrorCode == 0 && output.Result) {
                    config = await Util.GetDBDeatil(output);
                    if (config && config.UserDBName && config.UserDBName.length > 0) {
                        /*****Create Search Properties*****/
                        props = await this.CreateOrderSearchFilter(body, output);
                        /*****End Search Properties******/
                        let queryObj: any = await this.CreateOrderSearchCriteria(props);
                        let dispOrder: any = await this.CreateOrderDisplayCriteria(props);
                        //TBD: Get order list
                        retVal = await OrderDBHandle.GetOrderList(queryObj, dispOrder, config);
                    } else {
                        retVal.ErrorCode = 3;
                        retVal.Message = 'There are some error on selecting user db.';
                    }
                    retVal = await Util.SetOutputResponse(output, retVal);
                } else {
                    retVal.ErrorCode = 2;
                    retVal.Message = 'User should be logged in system before request.';
                }
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid request for order list.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async GetOrderDetail(header: any, body: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            //TBD: Order Detail
        } catch (error) {
            throw error;
        }
        return retVal;
    }

    async CreateNewOrder(header: any, body: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            //TBD: Order Create
        } catch (error) {
            throw error;
        }
        return retVal;
    }

    async UpdateOrderStatus(header: any, body: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            //TBD: Order Status Update
        } catch (error) {
            throw error;
        }
        return retVal;
    }

    /*************End of Api Methods*************/

    /********Start of Supporting Methods*********/
    async CreateOrderSearchCriteria(searchProps: SearchQueryProperties) {
        let searchCrit: any = {};
        try {
            if (searchProps) {
                if (!searchProps.IsAdmin && !searchProps.IsOwner) {
                    searchCrit['ordercreatedbyid'] = searchProps.OrderCreatedById;
                }
                //TBD: Need to add other filter criteria as when it will be implemented.
            }
        } catch (e) {
            throw e;
        }
        return searchCrit;
    }

    async CreateOrderDisplayCriteria(searchProps: SearchQueryProperties) {
        let dispCrit: any = {};
        try {
            if (searchProps) {
                dispCrit["createddate"] = -1;
                dispCrit["orderdeliverydate"] = -1;
                // if (!searchProps.IsAdmin && !searchProps.IsOwner) {
                //     dispCrit['ordercreatedbyid'] = searchProps.OrderCreatedById;
                // }
                //TBD: Need to add other filter criteria as when it will be implemented.
            }
        } catch (e) {
            throw e;
        }
        return dispCrit;
    }

    async CreateOrderSearchFilter(reqSearch: any, obj: any) {
        let searchFilter: SearchQueryProperties = new SearchQueryProperties();
        try {
            if (reqSearch) {
                let canSeeAll: boolean = obj.userrole && obj.userrole.length > 0 && obj.userrole.trim().toUpperCase() == 'ADMIN';
                if (obj.usertype && obj.usertype.length > 0) {
                    switch (obj.usertype.trim().toUpperCase()) {
                        case 'OWNER':
                            searchFilter.IsOwner = true;
                            break;
                        case 'USER':
                            if (canSeeAll) {
                                searchFilter.IsAdmin = true;
                            } else {
                                searchFilter.OrderCreatedById = obj.userid;
                            }
                            break;
                        default:
                            searchFilter.OrderCreatedById = obj.userid;
                            break;
                    }
                }
                //TBD: Need to add other search criteria as when it will be implemented.
            }
        } catch (e) {
            throw e;
        }
        return searchFilter;
    }



    /********End of Supporting Methods*********/
}

export let OrderOpHandle = new OrderOpHandler();