import { MongoClient, Db } from 'mongodb';
import { DBConfigEntity, MethodResponse, DBConfiguaration } from '../../CommonModule/Entities';
import { DBConfig, UserDBCollection } from '../../DBModule/DBConfig';
import { DBClient } from '../../DBModule/DBClient';
import { InventoryProdType, OrderDetail } from '../../CommonModule/DBEntities';

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

    async GetRetailerDetails(retailerId: string, config: DBConfiguaration) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        let result: any = null;
        let errorCode: number = 0;
        try {
            if (retailerId && retailerId.length > 0) {
                let initconfig: DBConfigEntity = DBConfig;
                initconfig.UserDBUrl = config.UserDBUrl;
                initconfig.UserDBName = config.UserDBName;
                mClient = await DBClient.GetMongoClient(initconfig);
                let db: Db = await mClient.db(config.UserDBName);
                await db.collection(UserDBCollection.Retailers).findOne({ retailerid: retailerId }).then(itm => {
                    if (itm) {
                        result = itm;
                    } else {
                        errorCode = 12;
                    }
                }).catch(err => {
                    errorCode = 13;
                });
            } else {
                errorCode = 11;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 11:
                    retVal.Message = 'Empty retailer id.';
                    break;
                case 12:
                    retVal.Message = 'Retailer not found.';
                    break;
                case 13:
                    retVal.Message = 'DB error occurred.';
                    break;
                default:
                    retVal.Result = result;
                    break;
            }
        } catch (e) {
            throw e;
        } finally {
            if (mClient) {
                mClient.close();
            }
        }
        return retVal;
    }

    async GetInventoryDetails(invIds: string[], config: DBConfiguaration) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        let result: any = null;
        let errorCode: number = 0;
        try {
            if (invIds && invIds.length > 0) {
                let initconfig: DBConfigEntity = DBConfig;
                initconfig.UserDBUrl = config.UserDBUrl;
                initconfig.UserDBName = config.UserDBName;
                mClient = await DBClient.GetMongoClient(initconfig);
                let db: Db = await mClient.db(config.UserDBName);
                await db.collection(UserDBCollection.InventoryProdType).find({ invid: { $in: invIds } }).toArray().then(val => {
                    if (val && val.length > 0) {
                        result = val;
                    } else {
                        errorCode = 23;
                    }
                }).catch(err => {
                    errorCode = 22
                });
            } else {
                errorCode = 21;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 11:
                    retVal.Message = 'Empty retailer id.';
                    break;
                case 12:
                    retVal.Message = 'Retailer not found.';
                    break;
                case 13:
                    retVal.Message = 'DB error occurred.';
                    break;
                default:
                    retVal.Result = result;
                    break;
            }
        } catch (e) {
            throw e;
        } finally {
            if (mClient) {
                mClient.close();
            }
        }
        return retVal;
    }

    async UpdateInventoryCount(invId: string, invCount: number, config: DBConfiguaration) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        let result: any = null;
        let errorCode: number = 0;
        try {
            if (invId && invId.length > 0) {
                let initconfig: DBConfigEntity = DBConfig;
                initconfig.UserDBUrl = config.UserDBUrl;
                initconfig.UserDBName = config.UserDBName;
                mClient = await DBClient.GetMongoClient(initconfig);
                let db: Db = await mClient.db(config.UserDBName);
                await db.collection(UserDBCollection.InventoryProdType).updateOne({ _id: invId }, { $set: { count: invCount } }, { upsert: true }).then(itm => {
                    if (itm && itm.upsertedCount > 0) {
                        result = true;
                    } else {
                        errorCode = 33;
                    }
                }).catch(err => {
                    errorCode = 32;
                });
            } else {
                errorCode = 31;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 31:
                    retVal.Message = 'Empty inventory item.';
                    break;
                case 32:
                    retVal.Message = 'DB error occurred.';
                    break;
                case 33:
                    retVal.Message = 'Item is not updated.';
                    break;
                default:
                    retVal.Result = result;
                    break;
            }
        } catch (e) {
            throw e;
        } finally {
            if (mClient) {
                mClient.close();
            }
        }
        return retVal;
    }

    async InsertOrUpdateOrderDetail(ord: OrderDetail, config: DBConfiguaration) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        let result: any = null;
        let errorCode: number = 0;
        try {
            if (ord) {
                let initconfig: DBConfigEntity = DBConfig;
                initconfig.UserDBUrl = config.UserDBUrl;
                initconfig.UserDBName = config.UserDBName;
                mClient = await DBClient.GetMongoClient(initconfig);
                let db: Db = await mClient.db(config.UserDBName);
                await db.collection(UserDBCollection.OrderDetail).updateOne({ _id: ord.OrderId }, ord, { upsert: true }).then(val => {
                    if (val && val.upsertedCount > 0) {
                        result = ord;
                    } else {
                        errorCode = 43;
                    }
                }).catch(err => {
                    errorCode = 42;
                });
            } else {
                errorCode = 41;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 41:
                    retVal.Message = 'Empty Order item.';
                    break;
                case 42:
                    retVal.Message = 'DB error occurred.';
                    break;
                case 43:
                    retVal.Message = 'Order is not updated or inserted.';
                    break;
                default:
                    retVal.Result = result;
                    break;
            }
        } catch (e) {
            throw e;
        } finally {
            if (mClient) {
                mClient.close();
            }
        }
        return retVal;
    }
}

export let OrderDBHandle = new OrderDBHandler();