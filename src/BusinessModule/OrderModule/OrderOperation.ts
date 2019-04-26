import { RegistrationDetail, User, OrderDetail, Retailer, OrderElement, InventoryProdType } from '../../CommonModule/DBEntities';
import { OrderItems } from "./../../CommonModule/DBEntities";
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
        let output: MethodResponse = null;
        let config: DBConfiguaration = null;
        try {
            //TBD: Order Create
            if (await OrderUtilHandle.ValidateCreateOrderRequest(body)) {
                output = await LoginHandle.ValidateHeader(header);
                if (output && output.ErrorCode == 0 && output.Result) {
                    config = await Util.GetDBDeatil(output);
                    if (config && config.UserDBName && config.UserDBName.length > 0) {
                        // Get Retailer details
                        let retailer: Retailer = await this.GetRetailerDetails(body.retailerid, config);
                        if (retailer) {
                            let ord: OrderDetail = await OrderUtilHandle.CreateOrderDetail(body, retailer);
                            if (ord && ord.OrderItems) {
                                // Verify Inventory and re-calculate
                                let elements: OrderElement[] = ord.OrderItems.Items;
                                if (elements && elements.length > 0) {
                                    let invItems: string[] = [];
                                    elements.forEach(ele => {
                                        if (ele) {
                                            invItems.push(ele.InventoryId);
                                        }
                                    });
                                    let invDetails: InventoryProdType[] = await this.GetInventoryDetails(invItems, config);
                                    if (invDetails && invDetails.length > 0) {
                                        // Validate Inventory
                                        await this.ValidateInventory(invDetails, ord);
                                        // Modify Inventory in tables
                                        await this.UpdateInventories(invDetails, ord, config);
                                        // Insert the order in table
                                        retVal = await OrderDBHandle.InsertOrUpdateOrderDetail(ord, config);
                                        //TBD: Change the progress (change order owner and update progress)
                                        //TBD: Update RetailerTransaction table
                                    } else {
                                        retVal.ErrorCode = 6;
                                        retVal.Message = 'Inventory details not found.';
                                    }
                                } else {
                                    retVal.ErrorCode = 5;
                                    retVal.Message = 'No items selected.';
                                }
                            } else {
                                retVal.ErrorCode = 4;
                                retVal.Message = 'Error occurred during ';
                            }
                        } else {
                            retVal.ErrorCode = 5;
                            retVal.Message = 'Retailer details not found.';
                        }
                    } else {
                        retVal.ErrorCode = 3;
                        retVal.Message = 'There are some error on selecting user db.';
                    }
                    retVal = await Util.SetOutputResponse(output, retVal);
                } else {
                    retVal.ErrorCode = 2;
                    retVal.Message = 'User is not logged in or users session has expired';
                }
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Invalid Create New Order Request';
            }
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

    async GetRetailerDetails(retailerId: string, config: DBConfiguaration) {
        let retailer: Retailer = null;
        try {
            if (retailerId && retailerId.length > 0) {
                retailer = new Retailer();
                let output: MethodResponse = await OrderDBHandle.GetRetailerDetails(retailerId, config);
                if (output && output.ErrorCode == 0 && output.Result) {
                    let result = output.Result;
                    retailer.RetailerId = result.retailerid;
                    retailer.RetailerShopName = result.retailershopname;
                    retailer.RetailerName = result.retailername;
                    retailer.MaxPendingAmount = result.maxpendingamount;
                    retailer.RetailerContactNumber = result.retailercontactnumber;
                }
            }
        } catch (e) {
            throw e;
        }
        return retailer;
    }

    async GetInventoryDetails(invIds: string[], config: DBConfiguaration) {
        let inventories: InventoryProdType[] = [];
        try {
            if (invIds && invIds.length > 0) {
                let inventory: InventoryProdType = null;
                let output: MethodResponse = await OrderDBHandle.GetInventoryDetails(invIds, config);
                if (output && output.ErrorCode == 0 && output.Result) {
                    let result: any[] = output.Result;
                    if (result && result.length > 0) {
                        result.forEach(res => {
                            if (res) {
                                inventory = new InventoryProdType();
                                inventory.InvId = res.invid;
                                inventory.ProductName = res.productname;
                                inventory.ProductSpecification = res.productspecification;
                                inventory.ProductType = res.producttype;
                                inventory.SellPrice = res.sellprice;
                                inventory.ExpiryDate = res.expirydate;
                                inventory.DiscountPercentage = res.discountpercentage;
                                inventory.MRP = res.mrp;
                                inventory.Count = res.count;

                                inventories.push(inventory);
                            }
                        });
                    }
                }
            }
        } catch (e) {
            throw e;
        }
        return inventories;
    }

    async ValidateInventory(invDetails: InventoryProdType[], ord: OrderDetail) {
        try {
            if (invDetails && invDetails.length > 0 && ord && ord.OrderItems && ord.OrderItems.Items && ord.OrderItems.Items.length > 0) {
                let orderMain: OrderItems = ord.OrderItems;
                let elements: OrderElement[] = orderMain.Items;
                let prod: InventoryProdType = null;
                let sumPrice: number = 0;
                elements.forEach(ele => {
                    if (ele) {
                        prod = invDetails.find(itm => itm.InvId == ele.InventoryId);
                        if (prod) {
                            ele.ItemDiscountPercentage = prod.DiscountPercentage;
                            ele.ItemMrp = prod.MRP;
                            ele.ItemName = prod.ProductName;
                            ele.SellPrice = prod.SellPrice;
                            ele.ItemBillSize = ele.ItemOrderSize > prod.Count ? prod.Count : ele.ItemOrderSize;
                            ele.ItemExpiryDate = prod.ExpiryDate;
                            ele.TotalDiscountAmount = (ele.ItemBillSize * ((ele.SellPrice * ele.ItemDiscountPercentage)) / 100);
                            ele.TotalPrice = (ele.ItemBillSize * ele.SellPrice);
                            ele.TotalDiscountedPrice = ele.TotalPrice - ele.TotalDiscountAmount;
                            if (ele.ApplyDiscount == 'Y' || ele.ApplyDiscount == 'y') {
                                sumPrice = sumPrice + ele.TotalDiscountedPrice;
                            } else {
                                sumPrice = sumPrice + ele.TotalPrice;
                            }
                            ele.ItemExclude = 'N';
                        } else {
                            ele.ItemDiscountPercentage = prod.DiscountPercentage;
                            ele.ItemMrp = prod.MRP;
                            ele.ItemName = prod.ProductName;
                            ele.SellPrice = prod.SellPrice;
                            ele.ItemBillSize = 0;
                            ele.ItemExpiryDate = prod.ExpiryDate;
                            ele.TotalDiscountAmount = 0;
                            ele.TotalPrice = 0;
                            ele.TotalDiscountedPrice = 0;
                            ele.ItemExclude = 'Y';
                        }
                    }
                });
                orderMain.TotalNormalPrice = sumPrice;
                if (orderMain.ApplyOverAllDiscount == 'Y' || orderMain.ApplyOverAllDiscount == 'y') {
                    orderMain.DiscountAmount = sumPrice > 0 ? sumPrice * (orderMain.DiscountPercentage / 100) : 0;
                } else {
                    orderMain.DiscountAmount = 0;
                }
                orderMain.TotalDiscountedPrice = (sumPrice - orderMain.DiscountAmount) > 0 ? (sumPrice - orderMain.DiscountAmount) : 0;
                if (orderMain.ApplyOverAllDiscount == 'Y' || orderMain.ApplyOverAllDiscount == 'y') {
                    orderMain.FinalPrice = orderMain.TotalDiscountedPrice;
                } else {
                    orderMain.FinalPrice = orderMain.TotalNormalPrice;
                }
                orderMain.AmountPending = orderMain.FinalPrice - orderMain.AmountPaid;
            }
        } catch (e) {
            throw e;
        }
    }

    async UpdateInventories(invItems: InventoryProdType[], ord: OrderDetail, config: DBConfiguaration) {
        try {
            if (invItems && invItems.length > 0 && ord && ord.OrderItems && ord.OrderItems.Items && ord.OrderItems.Items.length > 0) {
                let orderMain: OrderItems = ord.OrderItems;
                let elements: OrderElement[] = orderMain.Items;
                let updInventoryList: InventoryProdType[] = [];
                let invItem: InventoryProdType = null;
                let res: MethodResponse = null;
                let isRecalculationRequired: boolean = false;
                elements.forEach(async ele => {
                    if (ele) {
                        invItem = invItems.find(item => item.InvId == ele.InventoryId);
                        if (invItem) {
                            invItem.Count = invItem.Count - ele.ItemBillSize;
                            try {
                                res = await OrderDBHandle.UpdateInventoryCount(invItem.InvId, invItem.Count, config);
                                if (res && res.ErrorCode == 0 && res.Result) {
                                    updInventoryList.push(invItem);
                                } else {
                                    ele.ItemExclude = 'Y';
                                    isRecalculationRequired = true;
                                }
                            } catch (error) {
                                ele.ItemExclude = 'Y';
                                isRecalculationRequired = true;
                            }
                        } else {
                            ele.ItemExclude = 'Y';
                            isRecalculationRequired = true;
                        }
                    }
                });

                if (isRecalculationRequired) {
                    //TBD: Recalculate
                    let sumPrice: number = 0;
                    elements.forEach(async ele => {
                        if (ele) {
                            if (ele.ItemExclude != 'Y') {
                                if (ele.ApplyDiscount == 'Y' || ele.ApplyDiscount == 'y') {
                                    sumPrice = sumPrice + ele.TotalDiscountedPrice;
                                } else {
                                    sumPrice = sumPrice + ele.TotalPrice;
                                }
                            } else {
                                ele.ItemBillSize = 0;
                                ele.TotalDiscountAmount = 0;
                                ele.TotalPrice = 0;
                                ele.TotalDiscountedPrice = 0;
                            }
                        }
                    });
                    orderMain.TotalNormalPrice = sumPrice;
                    if (orderMain.ApplyOverAllDiscount == 'Y' || orderMain.ApplyOverAllDiscount == 'y') {
                        orderMain.DiscountAmount = sumPrice > 0 ? sumPrice * (orderMain.DiscountPercentage / 100) : 0;
                    } else {
                        orderMain.DiscountAmount = 0;
                    }
                    orderMain.TotalDiscountedPrice = (sumPrice - orderMain.DiscountAmount) > 0 ? (sumPrice - orderMain.DiscountAmount) : 0;
                    if (orderMain.ApplyOverAllDiscount == 'Y' || orderMain.ApplyOverAllDiscount == 'y') {
                        orderMain.FinalPrice = orderMain.TotalDiscountedPrice;
                    } else {
                        orderMain.FinalPrice = orderMain.TotalNormalPrice;
                    }
                    orderMain.AmountPending = orderMain.FinalPrice - orderMain.AmountPaid;
                }
            }
        } catch (e) {
            throw e;
        }
    }

    async UpdateOrderProgress(ordId: string, ownerId: string, config: DBConfiguaration) {
        try {

        } catch (e) {
            throw e;
        }
    }

    /********End of Supporting Methods*********/
}

export let OrderOpHandle = new OrderOpHandler();