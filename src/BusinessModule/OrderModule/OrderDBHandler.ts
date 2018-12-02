import { MongoClient, Db } from 'mongodb';

import { DBConfigEntity } from '../../CommonModule/Entities';
import { DBConfig } from '../../DBModule/DBConfig';
import { DBClient } from '../../DBModule/DBClient';

class OrderDBHandler{
    async GetOrderList(reqData:any, config:DBConfigEntity){
        let retVal:any[];
        let mClient:MongoClient;
        try{
            if(reqData){
                //let config:DBConfigEntity = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                //config.UserDBName = "MediStockDB";
                let db:Db = await mClient.db(config.UserDBName);
                await db.collection("Orders").find({}).toArray().then(arr=>{
                    retVal = arr;
                    console.log(1);
                })
                .catch(err=>{
                    throw err;
                });
                console.log(2);
            }
        }
        catch(e){
            throw e;
        }
        finally{
            if(mClient){
                mClient.close();
            }
        }
        return retVal;
    }
}

export let OrderDBHandle = new OrderDBHandler();