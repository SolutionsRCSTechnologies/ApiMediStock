import { MongoClient, Db } from 'mongodb';
import { DBConfigEntity, MethodResponse, DBConfiguaration } from '../../CommonModule/Entities';
import { DBConfig, UserDBCollection } from '../../DBModule/DBConfig';
import { DBClient } from '../../DBModule/DBClient';

class OrderDBHandler {
    async GetOrderList(reqData: any, dispOrder: any, config: DBConfiguaration) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        let result: any = null;
        let errorCode: number = 0;
        try {
            if (reqData && dispOrder && config) {
                let initconfig: DBConfigEntity = DBConfig;
                initconfig.UserDBUrl = config.UserDBUrl;
                initconfig.UserDBName = config.UserDBName;
                mClient = await DBClient.GetMongoClient(initconfig);
                let db: Db = await mClient.db(config.UserDBName);
                await db.collection(UserDBCollection.OrderDetail).find(reqData).sort(dispOrder).toArray().then(arr => {
                    if (arr && arr.length > 0) {
                        result = arr;
                    } else {
                        errorCode = 2;
                    }
                }).catch(err => {
                    throw err;
                });
            } else {
                errorCode = 1;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 1:
                    retVal.Message = 'Filetr query container or the DB configuaration isempty or null.';
                    break;
                case 2:
                    break;
                default:
                    retVal.Result = result;
                    break;
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