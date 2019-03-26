import { OrderOpHandle } from './OrderOperation';
import { MethodResponse } from '../../CommonModule/Entities';
import { LicenseHandle } from '../AuthModule/License/LicenseHandler';
import { LoginHandle } from '../AuthModule/Login/LoginHandler';
import { Util } from '../../CommonModule/UtilHandler';

class OrderHandler {
  async GetOrderList(header: any, body: any) {
    let retVal: MethodResponse = new MethodResponse();
    try {
      retVal = await OrderOpHandle.GetOrderList(header, body);
    } catch (e) {
      throw e;
    }
    return retVal;
  }

  async GetOrderDetail(header: any, body: any) {
    let retVal: MethodResponse = new MethodResponse();
    try {
      retVal = await OrderOpHandle.GetOrderDetail(header, body);
    } catch (e) {
      throw e;
    }
    return retVal;
  }

  async UpdateOrderStatus(header: any, body: any) {
    let retVal: MethodResponse = new MethodResponse();
    try {
      retVal = await OrderOpHandle.UpdateOrderStatus(header, body);
    } catch (e) {
      throw e;
    }
    return retVal;
  }

  async CreateNewOrder(header: any, body: any) {
    let retVal: MethodResponse = new MethodResponse();
    try {
      retVal = await OrderOpHandle.CreateNewOrder(header, body);
    } catch (e) {
      throw e;
    }
    return retVal;
  }
}

export let OrderHandle = new OrderHandler();