import { OrderDBHandle } from './OrderDBHandler';
import { DBConfig } from '../../DBModule/DBConfig';

class OrderHandler {
  async GetOrderList(header: any, body: any) {
    let retVal = null;
    // if (reqData) {
    //   let config = DBConfig;
    //   config.UserDBName = "MediStockDB";
    //   await OrderDBHandle.GetOrderList(reqData, config).then(obj => {
    //     retVal = obj;
    //   }).catch(err => {
    //     throw err;
    //   });
    // }
    return retVal;
  }
}

export let OrderHandle = new OrderHandler();