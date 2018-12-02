import { OrderDBHandle } from './OrderDBHandler';
import { DBConfig } from '../../DBModule/DBConfig';

class OrderHandler{
   async GetOrderList(reqData:any){
       let retVal = null;
       if(reqData){
        let config = DBConfig;
        config.UserDBName = "MediStockDB";
        // await OrderDBHandle.GetOrderList(reqData, config).then(obj=>{
        //   retVal = obj;
        // }).catch(err=>{
        //   throw err;
        // });
        retVal = await OrderDBHandle.GetOrderList(reqData, config);
        console.log(0);
       }
       return retVal;
  } 
}

export let OrderHandle = new OrderHandler();