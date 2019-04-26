import { MongoClient, Db } from 'mongodb';
import { DBConfigEntity, MethodResponse, DBConfiguaration } from '../../CommonModule/Entities';
import { DBConfig, UserDBCollection } from '../../DBModule/DBConfig';
import { DBClient } from '../../DBModule/DBClient';
import { InventoryProdType, OrderDetail, OrderProgress } from '../../CommonModule/DBEntities';

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
                        result = ord.OrderId;
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

    // async GetApproverDetails(stats: string[], config: DBConfiguaration) {
    //     let retVal: MethodResponse = new MethodResponse();
    //     let mClient: MongoClient;
    //     let result: any = null;
    //     let errorCode: number = 0;
    //     try {
    //         if (stats && stats.length > 0) {
    //             let initconfig: DBConfigEntity = DBConfig;
    //             initconfig.UserDBUrl = config.UserDBUrl;
    //             initconfig.UserDBName = config.UserDBName;
    //             mClient = await DBClient.GetMongoClient(initconfig);
    //             let db: Db = await mClient.db(config.UserDBName);
    //             await db.collection(UserDBCollection.OrderApproverLevels).find({ statuslebel: { $in: stats } }).toArray().then(arr => {
    //                 if (arr && arr.length > 0) {
    //                     result = arr;
    //                 } else {
    //                     errorCode = 63;
    //                 }
    //             }).catch(err => {
    //                 errorCode = 62;
    //             });
    //         } else {
    //             errorCode = 61;
    //         }
    //         retVal.ErrorCode = errorCode;
    //         switch (errorCode) {
    //             case 61:
    //                 retVal.Message = 'Empty status level.';
    //                 break;
    //             case 62:
    //                 retVal.Message = 'DB error occurred.';
    //                 break;
    //             case 63:
    //                 retVal.Message = 'No record is found in DataBase.';
    //                 break;
    //             default:
    //                 retVal.Result = result;
    //                 break;
    //         }
    //     } catch (e) {
    //         throw e;
    //     } finally {
    //         if (mClient) {
    //             mClient.close();
    //         }
    //     }
    //     return retVal;
    // }

    async GetOrderById(orderId: string, config: DBConfiguaration) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        let result: any = null;
        let errorCode: number = 0;
        try {
            if (orderId && orderId.length > 0) {
                let initconfig: DBConfigEntity = DBConfig;
                initconfig.UserDBUrl = config.UserDBUrl;
                initconfig.UserDBName = config.UserDBName;
                mClient = await DBClient.GetMongoClient(initconfig);
                let db: Db = await mClient.db(config.UserDBName);
                await db.collection(UserDBCollection.OrderDetail).findOne({ orderid: orderId }).then(itm => {
                    if (itm) {
                        result = itm;
                    } else {
                        errorCode = 72;
                    }
                }).catch(err => {
                    errorCode = 73;
                });
            } else {
                errorCode = 71;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 71:
                    retVal.Message = 'Empty order id.';
                    break;
                case 72:
                    retVal.Message = 'Order not found.';
                    break;
                case 73:
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

    async GetStatusDetails(config: DBConfiguaration) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        let result: any = null;
        let errorCode: number = 0;
        try {
            let initconfig: DBConfigEntity = DBConfig;
            initconfig.UserDBUrl = config.UserDBUrl;
            initconfig.UserDBName = config.UserDBName;
            mClient = await DBClient.GetMongoClient(initconfig);
            let db: Db = await mClient.db(config.UserDBName);
            await db.collection(UserDBCollection.OrderApproverLevels).find().toArray().then(arr => {
                if (arr && arr.length > 0) {
                    result = arr;
                } else {
                    errorCode = 101;
                }
            }).catch(err => {
                errorCode = 102;
            });
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 101:
                    retVal.Message = 'Empty status level entry table.';
                    break;
                case 102:
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

    async UpdateOrderProgress(ordProgress: OrderProgress, orderId: string, config: DBConfiguaration) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        let result: any = null;
        let errorCode: number = 0;
        try {
            if (ordProgress && orderId && orderId.length > 0) {
                let initconfig: DBConfigEntity = DBConfig;
                initconfig.UserDBUrl = config.UserDBUrl;
                initconfig.UserDBName = config.UserDBName;
                mClient = await DBClient.GetMongoClient(initconfig);
                let db: Db = await mClient.db(config.UserDBName);
                await db.collection(UserDBCollection.OrderDetail).updateOne({ _id: orderId }, { $push: { orderflow: ordProgress } }).then(val => {
                    if (val && val.modifiedCount > 0) {
                        result = val.modifiedCount;
                    } else {
                        errorCode = 121;
                    }
                }).catch(err => {
                    errorCode = 122;
                });
            } else {
                errorCode = 123
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 121:
                    retVal.Message = 'Empty status level entry table.';
                    break;
                case 122:
                    retVal.Message = 'DB error occurred.';
                    break;
                case 123:
                    retVal.Message = 'No record is found in DataBase.';
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