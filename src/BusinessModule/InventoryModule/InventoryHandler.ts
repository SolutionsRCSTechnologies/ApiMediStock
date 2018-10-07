import { InventoryDBHandle } from './InventoryDBHandler';
import { DBConfig } from '../../DBModule/DBConfig';

class InventoryHandler{
   async SetInventoryTypeList(reqData:any){
       let retVal = null;
       if(reqData){
        let config = DBConfig;
        config.UserDBName = "MediStockDB";
        await InventoryDBHandle.SetInventoryTypeList(reqData, config).then(obj=>{
          retVal = obj;
        }).catch(err=>{
          throw err;
        });
       }
       return retVal;
  }

  async AddUpdateInventorytype(reqData:any[]){
    let retVal = null;
    let updatedObj:any[] ;
    let insertedObj:any[];
    console.log(10);
    if(reqData){
     let config = DBConfig;
     config.UserDBName = "MediStockDB";
     try{
       updatedObj = reqData.filter(item=>item.productId);
       insertedObj = reqData.filter(item=> !item.productId);
     }
     catch(error){
      console.log(20);
      console.log(error);
     }
     if(insertedObj.length > 0){
      await InventoryDBHandle.SetInventoryTypeList(insertedObj, config).then(obj=>{
        retVal = obj;
      }).catch(err=>{
        throw err;
      });
    }

    if(updatedObj.length > 0){
      await InventoryDBHandle.UpdateInventoryTypeList(updatedObj, config).then(obj=>{
        retVal = obj;
      }).catch(err=>{
        throw err;
      });
    }
     
     

    //  await InventoryDBHandle.SetInventoryTypeList(reqData, config).then(obj=>{
    //    retVal = obj;
    //  }).catch(err=>{
    //    throw err;
    //  });

    }
    return retVal;
  }

  

  async GetInventoryTypeList(listObj:any){
    let retVal = null;
    if(listObj){
     let config = DBConfig;
     config.UserDBName = "MediStockDB";
     await InventoryDBHandle.GetInventoryTypeList(listObj, config).then(obj=>{
       retVal = obj;
     }).catch(err=>{
       throw err;
     });
    }
    return retVal;
}

async InventoryTypeget(listObj:any){
  let retVal = null;
  if(listObj){
   let config = DBConfig;
   config.UserDBName = "MediStockDB";
   await InventoryDBHandle.InventoryTypeget(listObj, config).then(obj=>{
     retVal = obj;
   }).catch(err=>{
     throw err;
   });
  }
  return retVal;
}

  
  async deleteInventoryTypeList(productNameobj:any){
    let retVal = null;
    if(productNameobj){
     let config = DBConfig;
     config.UserDBName = "MediStockDB";
     await InventoryDBHandle.deleteInventoryTypeList(productNameobj, config).then(obj=>{
       retVal = obj;
     }).catch(err=>{
       throw err;
     });
    }
    return retVal;
}
  
}

export let inventoryHandle = new InventoryHandler();