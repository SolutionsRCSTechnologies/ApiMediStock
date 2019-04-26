import { RegistrationDetail, User, OrderDetail, Retailer, OrderElement, InventoryProdType, OrderProgress, OrderApproverLevels } from '../../CommonModule/DBEntities';
import { OrderItems } from "./../../CommonModule/DBEntities";
import { OrderUtilHandle } from "./OrderUtilHandler";
import { Util } from '../../CommonModule/UtilHandler';
import { OrderDBHandle } from './OrderDBHandler';
import { MethodResponse, DBConfiguaration, SearchQueryProperties, OrderStatus } from '../../CommonModule/Entities';
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
                                        // Change the progress (change order owner and update progress)
                                        let ordStat: OrderStatus = new OrderStatus();
                                        ordStat.UserId = header.userid;
                                        ordStat.UserName = output.UserName;
                                        ordStat.OrderId = ord.OrderId;
                                        let result: MethodResponse = await this.UpdateOrderProgress(ordStat, config);
                                        if (result && result.ErrorCode != 0) {
                                            retVal.ErrorCode = result.ErrorCode;
                                            retVal.Message = result.Message;
                                        }
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
        let output: MethodResponse = null;
        let config: DBConfiguaration = null;
        try {
            // Order Status Update
            if (await OrderUtilHandle.ValidateOrderProgressRequest(body)) {
                output = await LoginHandle.ValidateHeader(header);
                if (output && output.ErrorCode == 0 && output.Result) {
                    config = await Util.GetDBDeatil(output);
                    if (config && config.UserDBName && config.UserDBName.length > 0) {
                        let orderStat: OrderStatus = await OrderUtilHandle.GetOrderStatus(body);
                        retVal = await this.UpdateOrderProgress(orderStat, config);
                    } else {
                        retVal.ErrorCode = 3;
                        retVal.Message = 'No user database is available.';
                    }
                    retVal = await Util.SetOutputResponse(output, retVal);
                } else {
                    retVal.ErrorCode = 2;
                    retVal.Message = 'User is not authenticated.';
                }
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Request body is not valid.';
            }
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

    async UpdateOrderProgress(ordStatus: OrderStatus, config: DBConfiguaration) {
        let retVal: MethodResponse = new MethodResponse();
        let output: MethodResponse = null;
        try {
            if (ordStatus) {
                output = await OrderDBHandle.GetOrderById(ordStatus.OrderId, config);
                if (output && output.ErrorCode == 0 && output.Result) {
                    let ord: OrderDetail = await OrderUtilHandle.CreateOrderDetail(output.Result, null);
                    let ordProgress: OrderProgress[] = ord ? ord.OrderFlow : [];
                    if (ordProgress && ordProgress.length > 0) {
                        ordProgress = ordProgress.sort(itm => itm.OrderSequence);
                        let progStat: OrderProgress = ordProgress.pop();
                        let lastStatus: string = progStat && progStat.OrderStatus && progStat.OrderStatus.length > 0 ? progStat.OrderStatus : '';
                        let lastSeq: number = progStat && progStat.OrderSequence > 0 ? progStat.OrderSequence : 0;
                        let ownerId: string = ordStatus.OwnerId;
                        if (!(lastStatus && lastStatus.length > 0)) {
                            lastStatus = 'CREATE';
                        }
                        output = null;
                        output = await OrderDBHandle.GetStatusDetails(config);
                        if (output && output.ErrorCode == 0 && output.Result) {
                            let approvers: OrderApproverLevels[] = await OrderUtilHandle.GetOrderApprovers(output.Result);
                            if (approvers && approvers.length > 0) {
                                let lastApprovers: OrderApproverLevels = await approvers.find(obj => obj.StatusLebel == lastStatus && (obj.Active == 'Y' || obj.Active == 'y'));
                                let nextStatus: string = ordStatus.Status;
                                let nextApprovers: OrderApproverLevels = await approvers.find(obj => obj.StatusLebel == nextStatus && (obj.Active == 'Y' || obj.Active == 'y'));
                                let approversCount: number = nextApprovers.Approvers && nextApprovers.Approvers.length > 0 ? nextApprovers.Approvers.length : -1;
                                let isValid: boolean = false;
                                if (ordStatus.IsDemoted) {
                                    isValid = lastApprovers.FromDemoteStatuses && lastApprovers.FromDemoteStatuses.length > 0 && lastApprovers.FromDemoteStatuses.findIndex(itm => itm == nextStatus) > 0;
                                } else {
                                    isValid = lastApprovers.FromPromoteStatuses && lastApprovers.FromPromoteStatuses.length > 0 && lastApprovers.FromPromoteStatuses.findIndex(itm => itm == nextStatus) > 0;
                                }
                                if (isValid) {
                                    if (ownerId && ownerId.length > 0) {
                                        isValid = false;
                                        isValid = nextApprovers.Approvers && nextApprovers.Approvers.length > 0 && nextApprovers.Approvers.findIndex(itm => itm == ownerId) > 0;
                                    } else if (approversCount > 0) {
                                        let indx: number = 0;
                                        let time: number = new Date().getTime();
                                        indx = time % (approversCount - 1);
                                        ownerId = nextApprovers.Approvers[indx];
                                    }
                                    if (isValid && ownerId && ownerId.length > 0) {
                                        let progress: OrderProgress = new OrderProgress();
                                        progress.OrderOwnedById = ownerId;
                                        progress.OrderStatus = nextStatus;
                                        progress.OrderStatusChangedById = ordStatus.UserId;
                                        progress.TimeStamp = new Date();
                                        progress.OrderSequence = lastSeq + 1;
                                        progress.OrderStatusNumber = ordStatus.StatusNumber;
                                        progress.OrderLastStatus = lastStatus;
                                        //TBD: Get Owner Name and User Name
                                        retVal = await OrderDBHandle.UpdateOrderProgress(progress, ordStatus.OrderId, config);
                                    } else {
                                        retVal.ErrorCode = 114;
                                        retVal.Message = 'Owner id is not available.';
                                    }
                                } else {
                                    retVal.ErrorCode = 115;
                                    retVal.Message = 'Given status is not valid.';
                                }
                            } else {
                                retVal.ErrorCode = 116;
                                retVal.Message = 'No approver is available in Users Database.';
                            }
                        } else {
                            retVal.ErrorCode = output.ErrorCode;
                            retVal.Message = output.Message;
                        }
                    } else {
                        retVal.ErrorCode = 117;
                        retVal.Message = 'Invalid order as no progress is available.';
                    }
                } else {
                    retVal.ErrorCode = output.ErrorCode;
                    retVal.Message = output.Message;
                }
            } else {
                retVal.ErrorCode = 81;
                retVal.Message = 'Order progress status is empty.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    /********End of Supporting Methods*********/
}

export let OrderOpHandle = new OrderOpHandler();