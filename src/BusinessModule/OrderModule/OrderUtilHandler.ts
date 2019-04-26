import { LicenseDetail, LicensePurchase, OrderDetail, OrderProgress, OrderElement } from '../../CommonModule/DBEntities';
import { OrderItems, Retailer } from "./../../CommonModule/DBEntities";
import { LoginUtilHandle } from "./../AuthModule/Login/LoginUtilHandler";
import { MethodResponse } from '../../CommonModule/Entities';
import { isDate } from 'util';
import { Double } from 'bson';

class OrderUtilHandler {
    async ValidateOrderDetailsRequest(req: any) {
        let isValid: boolean = true;
        try {
            if (req) {
                if (req.filtercriteria) {
                    if (!(req.filtercriteria.placedby && req.filtercriteria.placedby.length > 0)) {
                        isValid = false;
                    }
                    if (req.filtercriteria.datebetween) {
                        if (!(isDate(req.filtercriteria.datebetween.startdate))) {
                            isValid = false;
                        }
                        if (!(isDate(req.filtercriteria.datebetween.enddate))) {
                            isValid = false;
                        }
                        if (isValid) {
                            isValid = req.filtercriteria.datebetween.enddate > req.filtercriteria.datebetween.startdate;
                        }
                    }
                    if (req.filtercriteria.daterange) {
                        let range = req.filtercriteria.daterange.trim().toUpperCase();
                        switch (range) {
                            case 'LASTMONTH':
                            case 'LASTQUATER':
                            case 'LASTHALFYEAR':
                            case 'LASTYEAR':
                                break;
                            default:
                                isValid = false;
                                break;
                        }
                    }
                }
                if (req.displaycriteria) {
                    if (!(req.displaycriteria.sortoption && req.displaycriteria.sortoption.length > 0)) {
                        isValid = false;
                    }
                    if (req.displaycriteria.contentsize) {
                        if (!(req.displaycriteria.contentsize.startindex && req.displaycriteria.contentsize.startindex > 0)) {
                            isValid = false;
                        }
                        if (!(req.displaycriteria.contentsize.pagesize && req.displaycriteria.contentsize.pagesize > 0)) {
                            isValid = false;
                        }
                    }
                }
            } else {
                isValid = false;
            }
        } catch (e) {
            throw e;
        }
        return isValid;
    }


    async ValidateCreateOrderRequest(req: any) {
        let isValid: boolean = true;
        try {
            if (req) {

            } else {
                isValid = false;
            }
        } catch (e) {
            throw e;
        }
        return isValid;
    }

    async CreateEachOrderItem(ordItem: any) {
        let retVal: OrderElement = null;
        try {
            if (ordItem) {
                retVal = new OrderElement();
                if (ordItem.itemname && ordItem.itemname.length > 0) {
                    retVal.ItemName = ordItem.itemname;
                }
                if (ordItem.inventoryid && ordItem.inventoryid.length > 0) {
                    retVal.InventoryId = ordItem.inventoryid;
                }
                if (ordItem.itemmrp && ordItem.itemmrp > 0) {
                    retVal.ItemMrp = ordItem.itemmrp;
                } else {
                    retVal.ItemMrp = 0;
                }
                if (ordItem.itembillsize && ordItem.itembillsize > 0) {
                    retVal.ItemBillSize = ordItem.itembillsize;
                } else {
                    retVal.ItemBillSize = 0;
                }
                if (ordItem.itemexclude && ordItem.itemexclude.length > 0) {
                    retVal.ItemExclude = ordItem.itemexclude;
                } else {
                    retVal.ItemExclude = 'N';
                }
                if (ordItem.itemordersize && ordItem.itemordersize > 0) {
                    retVal.ItemOrderSize = ordItem.itemordersize;
                } else {
                    retVal.ItemOrderSize = 0;
                }
                if (ordItem.sellprice && ordItem.sellprice > 0) {
                    retVal.SellPrice = ordItem.sellprice;
                } else {
                    retVal.SellPrice = 0;
                }
                if (ordItem.itemdiscountpercentage && ordItem.itemdiscountpercentage > 0) {
                    retVal.ItemDiscountPercentage = ordItem.itemdiscountpercentage;
                } else {
                    retVal.ItemDiscountPercentage = 0;
                }
                if (ordItem.totaldiscountamount && ordItem.totaldiscountamount > 0) {
                    retVal.TotalDiscountAmount = ordItem.totaldiscountamount;
                } else {
                    if (retVal.ItemExclude != 'Y') {
                        let sPrice: number = retVal.SellPrice;
                        let discountPer: number = retVal.ItemDiscountPercentage;
                        let orderSize: number = retVal.ItemOrderSize;
                        retVal.TotalDiscountAmount = orderSize * ((sPrice * discountPer) / 100);
                    } else {
                        retVal.TotalDiscountAmount = 0;
                    }
                }
                if (ordItem.itemcompanyname && ordItem.itemcompanyname.length > 0) {
                    retVal.ItemCompanyName = ordItem.itemcompanyname;
                }
                if (ordItem.itemexpirydate && isDate(ordItem.itemexpirydate)) {
                    retVal.ItemExpiryDate = ordItem.itemexpirydate;
                }

                if (ordItem.totaldiscountedprice && ordItem.totaldiscountedprice > 0) {
                    retVal.TotalDiscountedPrice = ordItem.totaldiscountedprice;
                } else {
                    if (retVal.ItemExclude != 'Y') {
                        let orderSize: number = retVal.ItemOrderSize;
                        retVal.TotalDiscountedPrice = ((orderSize * retVal.SellPrice) - retVal.TotalDiscountAmount);
                    } else {
                        retVal.TotalDiscountedPrice = 0;
                    }
                }
                if (ordItem.applydiscount && ordItem.applydiscount.length > 0) {
                    retVal.ApplyDiscount = ordItem.applydiscount;
                } else {
                    retVal.ApplyDiscount = 'N';
                }
                if (ordItem.totalprice && ordItem.totalprice > 0) {
                    retVal.TotalPrice = ordItem.totalprice;
                } else {
                    if (retVal.ItemExclude != 'Y') {
                        let orderSize: number = retVal.ItemOrderSize;
                        retVal.TotalPrice = (orderSize * retVal.SellPrice);
                    } else {
                        retVal.TotalPrice = 0;
                    }
                }
            }
        } catch (error) {
            throw error;
        }
        return retVal;
    }

    async CreateOrderItems(ord: any) {
        let retVal: OrderItems = null;
        try {
            if (ord) {
                retVal = new OrderItems();
                let sumofeachitemsprice: number = 0;
                if (ord.items && ord.items.length > 0) {
                    retVal.Items = [];
                    ord.items.forEach(async ele => {
                        let ordElement: OrderElement = await this.CreateEachOrderItem(ele);
                        if (ordElement) {
                            retVal.Items.push(ordElement);
                        }
                    });
                }
                if (ord.itemsdelivered && ord.itemsdelivered.length > 0) {
                    retVal.ItemsDelivered = [];
                    ord.itemsdelivered.forEach(async ele => {
                        let ordElement: OrderElement = await this.CreateEachOrderItem(ele);
                        if (ordElement) {
                            retVal.ItemsDelivered.push(ordElement);
                        }
                    });
                }
                if (ord.discountpercentage && ord.discountpercentage > 0) {
                    retVal.DiscountPercentage = ord.discountpercentage;
                } else {
                    retVal.DiscountPercentage = 0;
                }
                if (ord.amountpaid && ord.amountpaid > 0) {
                    retVal.AmountPaid = ord.amountpaid;
                } else {
                    retVal.AmountPaid = 0;
                }
                if (ord.applyoveralldiscount && ord.applyoveralldiscount.length > 0) {
                    retVal.ApplyOverAllDiscount = ord.applyoveralldiscount;
                } else {
                    retVal.ApplyOverAllDiscount = 'N';
                }
                if (retVal.Items && retVal.Items.length > 0) {
                    sumofeachitemsprice = 0;
                    retVal.Items.forEach(async ele => {
                        if (ele) {
                            if (ele.ApplyDiscount == 'Y' || ele.ApplyDiscount == 'y') {
                                sumofeachitemsprice = sumofeachitemsprice + ele.TotalDiscountedPrice;
                            } else {
                                sumofeachitemsprice = sumofeachitemsprice + ele.TotalPrice;
                            }
                        }
                    });
                }
                if (ord.totalnormalprice && ord.totalnormalprice > 0) {
                    retVal.TotalNormalPrice = ord.totalnormalprice;
                } else {
                    retVal.TotalNormalPrice = sumofeachitemsprice;
                }
                if (ord.discountamount && ord.discountamount > 0) {
                    retVal.DiscountAmount = ord.discountamount;
                } else {
                    if (retVal.ApplyOverAllDiscount == 'Y' || retVal.ApplyOverAllDiscount == 'y') {
                        if (sumofeachitemsprice > 0) {
                            retVal.DiscountAmount = (sumofeachitemsprice * retVal.DiscountPercentage) / 100;
                        } else {
                            retVal.DiscountAmount = 0;
                        }
                    } else {
                        retVal.DiscountAmount = 0;
                    }
                }
                if (ord.totaldiscountedprice && ord.totaldiscountedprice > 0) {
                    retVal.TotalDiscountedPrice = ord.totaldiscountedprice;
                } else {
                    retVal.TotalDiscountedPrice = (sumofeachitemsprice - retVal.DiscountAmount) > 0 ? (sumofeachitemsprice - retVal.DiscountAmount) : 0;
                }
                if (ord.finalprice && ord.finalprice > 0) {
                    retVal.FinalPrice = ord.finalprice;
                } else {
                    if (retVal.ApplyOverAllDiscount == 'Y' || retVal.ApplyOverAllDiscount == 'y') {
                        retVal.FinalPrice = retVal.TotalDiscountedPrice;
                    } else {
                        retVal.FinalPrice = retVal.TotalNormalPrice;
                    }
                }
                if (ord.amountpending && ord.amountpending > 0) {
                    retVal.AmountPending = ord.amountpending;
                } else {
                    retVal.AmountPending = retVal.FinalPrice - retVal.AmountPaid;
                }
            }
        } catch (error) {
            throw error;
        }
        return retVal;
    }

    async CreateOrderProgress(ordSp: any[]) {
        let retVal: OrderProgress[] = [];
        try {
            if (ordSp && ordSp.length > 0) {
                ordSp.forEach(ele => {
                    if (ele) {
                        let prog: OrderProgress = new OrderProgress();
                        if (ele.orderownedby && ele.orderownedby.length > 0) {
                            prog.OrderOwnedBy = ele.orderownedby;
                        } else {
                            prog.OrderOwnedBy = 'SYSTEM';
                        }
                        if (ele.orderownedbyid && ele.orderownedbyid.length > 0) {
                            prog.OrderOwnedById = ele.orderownedbyid;
                        } else {
                            prog.OrderOwnedById = 'SYSTEM';
                        }
                        if (ele.orderstatus && ele.orderstatus.length > 0) {
                            prog.OrderStatus = ele.orderstatus;
                        } else {
                            prog.OrderStatus = '';
                        }
                        if (ele.timestamp && isDate(ele.timestamp)) {
                            prog.TimeStamp = ele.timestamp;
                        }
                        if (ele.ordersequence && ele.ordersequence > 0) {
                            prog.OrderSequence = ele.ordersequence;
                        }
                        retVal.push(prog);
                    }
                });
            }
        } catch (error) {
            throw error;
        }
        return retVal;
    }

    async CreateOrderDetail(ordObj: any, retailer: Retailer) {
        let retVal: OrderDetail = new OrderDetail();
        try {
            if (ordObj) {
                if (ordObj.userid && ordObj.userid.length > 0) {
                    retVal.OrderCreatedById = ordObj.userid;
                }
                if (ordObj.orderownedbyid && ordObj.orderownedbyid.length > 0) {
                    retVal.OrderOwnedById = ordObj.orderownedbyid;
                } else {
                    retVal.OrderOwnedBy = ordObj.userid;
                }
                if (ordObj.orderownedby && ordObj.orderownedby.length > 0) {
                    retVal.OrderOwnedBy = ordObj.orderownedby;
                } else {
                    retVal.OrderOwnedBy = ordObj.userid;
                }
                if (ordObj.orderstatus && ordObj.orderstatus.length > 0) {
                    let status: string = ordObj.orderstatus;
                    status = status.toUpperCase();
                    switch (status) {
                        case 'CREATE':
                        case 'SUBMIT':
                        case 'COMPLETE':
                        case 'DELIVER':
                        case 'CANCELED':
                        case 'PROGRESS':
                        case 'PACKED':
                        case 'VALIDATE':
                        case 'APPROVE':
                            break;
                        default:
                            status = 'CREATE';
                            break;
                    }
                    retVal.OrderStatus = status;
                } else {
                    retVal.OrderStatus = 'CREATE';
                }
                if (ordObj.ordersumbitdate && isDate(ordObj.ordersumbitdate)) {
                    retVal.OrderSubmitDate = ordObj.ordersumbitdate;
                } else {
                    retVal.OrderSubmitDate = new Date();
                }
                if (ordObj.orderdeliverydate && isDate(ordObj.orderdeliverydate)) {
                    retVal.OrderDeliveredDate = ordObj.orderdeliverydate;
                } else {
                    retVal.OrderDeliveredDate = new Date();
                    retVal.OrderDeliveredDate.setDate(new Date().getDate() + 1);
                }
                if (ordObj.isactive && ordObj.isactive.length > 0) {
                    switch (ordObj.isactive.toUpperCase()) {
                        case 'y':
                        case 'Y':
                            retVal.IsActive = 'Y';
                            break;
                        case 'n':
                        case 'N':
                            retVal.IsActive = 'N';
                        case 'c':
                        case 'C':
                            retVal.IsActive = 'C';
                            break;
                        default:
                            retVal.IsActive = 'Y';
                            break;
                    }
                } else {
                    retVal.IsActive = 'Y';
                }
                if (ordObj.iscanceled && ordObj.iscanceled.length > 0) {
                    switch (ordObj.iscanceled.toUpperCase()) {
                        case 'y':
                        case 'Y':
                            retVal.IsCanceled = 'Y';
                            break;
                        case 'n':
                        case 'N':
                            retVal.IsCanceled = 'N';
                        default:
                            retVal.IsCanceled = 'N';
                            break;
                    }
                } else {
                    retVal.IsCanceled = 'N';
                }
                if (ordObj.retailername && ordObj.retailername.length > 0) {
                    retVal.RetailerName = ordObj.retailername;
                } else if (retailer && retailer.RetailerName && retailer.RetailerName.length > 0) {
                    retVal.RetailerName = retailer.RetailerName;
                }
                if (ordObj.retailerid && ordObj.retailerid.length > 0) {
                    retVal.RetailerId = ordObj.retailerid;
                }
                if (ordObj.retailershopname && ordObj.retailershopname.length > 0) {
                    retVal.RetailerShopName = ordObj.retailershopname;
                }
                if (ordObj.retailercontactnumber && ordObj.retailercontactnumber > 0) {
                    retVal.RetailerContactNumber = ordObj.retailercontactnumber;
                } else if (retailer && retailer.RetailerContactNumber && retailer.RetailerContactNumber > 0) {
                    retVal.RetailerContactNumber = retailer.RetailerContactNumber;
                }
                if (ordObj.orderdelivereddate && isDate(ordObj.orderdelivereddate)) {
                    retVal.OrderDeliveredDate = ordObj.orderdelivereddate;
                }
                if (ordObj.orderdeliveredby && ordObj.orderdeliveredby.length > 0) {
                    retVal.OrderDeliveredBy = ordObj.orderdeliveredby;
                }
                if (ordObj.createddate && isDate(ordObj.createddate)) {
                    retVal.CreatedDate = ordObj.createddate;
                } else {
                    retVal.CreatedDate = new Date();
                }
                if (ordObj.updateddate && isDate(ordObj.updateddate)) {
                    retVal.UpdatedDate = ordObj.updateddate;
                } else {
                    retVal.UpdatedDate = new Date();
                }
                if (ordObj.createdby && ordObj.createdby.length > 0) {
                    retVal.CreatedBy = ordObj.createdby;
                } else {
                    retVal.CreatedBy = 'SYSTEM';
                }
                if (ordObj.updatedby && ordObj.updatedby.length > 0) {
                    retVal.UpdatedBy = ordObj.updatedby;
                } else {
                    retVal.UpdatedBy = 'SYSTEM';
                }
                if (ordObj.orderitems) {
                    retVal.OrderItems = await this.CreateOrderItems(ordObj.orderitems);
                }
                if (ordObj.orderflow && ordObj.orderflow.length > 0) {
                    retVal.OrderFlow = await this.CreateOrderProgress(ordObj.orderflow);
                }
                // if (ordObj.orderamount && ordObj.orderamount > 0) {
                //     retVal.OrderAmount = ordObj.orderamount;
                //     //TBD:
                // } else if (retVal.OrderItems) {
                //     //TBD:
                // }
                //TBD:
            }
        } catch (error) {
            throw error;
        }
        return retVal;
    }
}

export let OrderUtilHandle = new OrderUtilHandler();