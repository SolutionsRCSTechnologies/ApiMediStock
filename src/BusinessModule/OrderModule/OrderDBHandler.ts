import { MongoClient, Db } from 'mongodb';
import { DBConfigEntity, MethodResponse } from '../../CommonModule/Entities';
import { DBConfig } from '../../DBModule/DBConfig';
import { DBClient } from '../../DBModule/DBClient';

class OrderDBHandler {
    async GetOrderList(reqData: any, config: DBConfigEntity) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        try {
            if (reqData) {
                //let config:DBConfigEntity = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                //config.UserDBName = "MediStockDB";
                let db: Db = await mClient.db(config.UserDBName);
                await db.collection("Orders").find({}).toArray().then(arr => {
                    //retVal = arr;
                })
                    .catch(err => {
                        throw err;
                    });
            }
        }
        catch (e) {
            throw e;
        }
        finally {
            if (mClient) {
                mClient.close();
            }
        }
        return retVal;
    }
}

export let OrderDBHandle = new OrderDBHandler();