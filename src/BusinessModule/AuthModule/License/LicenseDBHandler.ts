import { MongoClient, Db } from 'mongodb';
import { Guid } from 'guid-typescript';

import { DBConfig, MainDBCollection, UserDBCollectionArr } from '../../../DBModule/DBConfig';
import { DBClient } from '../../../DBModule/DBClient';
import { DBConfigEntity, MethodResponse } from '../../../CommonModule/Entities';
import { isRegExp, isDate } from 'util';
import { RegistrationDetail, User, LicenseDetail } from '../../../CommonModule/DBEntities';

class LicenseDBHandler {
    async ValidateLicense(licid: string) {
        let isValid: boolean = false;
        let mClient: MongoClient = null;
        try {
            if (licid) {
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Licenses).findOne({ licid: licid, active: 'Y' }).then(res => {
                    if (res) {
                        let expiredt: number = 0;
                        let currenttime: number = Date.parse(new Date().toString());
                        if (res.expireat && isDate(res.expireat)) {
                            expiredt = Date.parse(res.expireat.toString());
                        }
                        if (currenttime < expiredt) {
                            isValid = true;
                        }
                    }
                }).catch(err => {
                    throw err;
                });
            }
        } catch (e) {
            throw e;
        } finally {
            if (mClient) {
                mClient.close();
            }
        }
        return isValid;
    }

    async CreateUserDB(dbName: string) {
        let isCreated: boolean = false;
        try {
            if (dbName && dbName.length > 0) {
                let url: string = DBConfig.UserDBUrl + '/' + dbName;
                isCreated = await DBClient.CreateUserDB(url);
            }
        } catch (e) {
            throw e;
        }
        return isCreated;
    }

    async CreateCollections(ownerId: string, licId: string) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        let errorCode: number = 0;
        let result: any[] = [];
        let item: any = null;
        try {
            if (ownerId && ownerId.length > 0 && licId && licId.length > 0) {
                let dbName: string = '';
                let dbUrl: string = '';
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Registrations).findOne({ ownerid: ownerId, licid: licId, licensed: 'Y', active: 'Y' }).then(res => {
                    if (res) {
                        dbName = res.dbname && res.dbname.length > 0 ? res.dbname : '';
                        dbUrl = res.dburl && res.dburl.length > 0 ? res.dburl : '';
                    } else {
                        errorCode = 2;
                    }
                }).catch(err => {
                    throw err;
                });
                if (mClient) {
                    mClient.close();
                }
                if (dbName && dbName.length > 0) {
                    let isUserDBUrl: boolean = false;
                    if (dbUrl && dbUrl.length > 0) {
                        isUserDBUrl = true;
                    }
                    mClient = await DBClient.GetUserDBMongoClient(config, isUserDBUrl);
                    db = await mClient.db(dbName);
                    let collArr = UserDBCollectionArr;
                    if (collArr && collArr.length > 0) {
                        collArr.forEach(async coll => {
                            if (coll && coll.length > 0) {
                                await db.createCollection(coll).then(res => {
                                    if (res) {
                                        console.log(res.collectionName + ' created succesfully.');
                                        item = { collectionName: res.collectionName, Created: 'Y' };
                                        result.push(item);
                                    }
                                }).catch(err => {
                                    console.log(coll + ' has thrown exception during collection creation.');
                                    item = { collectionName: coll, Created: 'N' };
                                    result.push(item);
                                });
                            }
                        });
                    }
                }
            } else {
                errorCode = 1;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 1:
                    retVal.Message = 'Owner id or the License id or both are missing.';
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

    async CheckExistingLicense(licId: string) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        let result: any = null;
        let errorCode: number = 0;
        try {
            if (licId && licId.length > 0) {
                let config = DBConfig;
                let isAvailable = false;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Licenses).findOne({ licid: licId, active: 'Y' }).then(res => {
                    if (res) {
                        result = {
                            licid: res.licid,
                            lictype: res.lictype,
                            expiredate: res.expiredt,
                            subscriptiontype: res.subscriptiontype,
                            ownerid: res.ownerid,
                            pendingamount: 0.0
                        };
                        isAvailable = true;
                    } else {
                        errorCode = 2;
                    }
                }).catch(err => {
                    throw err;
                });
                if (isAvailable) {
                    await db.collection(MainDBCollection.LicensePurchase).findOne({ licid: licId, active: 'Y' }).then(res => {
                        if (res) {
                            result.pendingamount = res.totalpendingamount;
                        } else {
                            errorCode = 3;
                        }
                    }).catch(err => {
                        throw err;
                    });
                } else {
                    errorCode = 2;
                }
            } else {
                errorCode = 1;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 1:
                    retVal.Message = 'License id is empty.';
                    break;
                case 2:
                    retVal.Message = 'No active license available.';
                    break;
                case 3:
                    retVal.Message = 'No active purchase entry available.';
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

    async CreateNewLicense(licObj: LicenseDetail) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        let result: any = null;
        let errorCode: number = 0;
        try {
            if (licObj) {
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Licenses).insertOne(licObj).then(res => {
                    if (res && res.insertedCount > 0) {
                        result = licObj.LicId;
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
                    retVal.Message = 'License object is null or empty.';
                    break;
                case 2:
                    retVal.Message = 'License creation is unsuccessfull.';
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

    async GetLicenseTypeInfo(licType: string) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        let errorCode: number = 0;
        let result: any = null;
        try {
            if (licType && licType.length > 0) {
                licType = licType.trim().toUpperCase();
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.LicenseTypes).findOne({ lictype: licType, active: 'Y' }).then(res => {
                    if (res) {
                        result = {
                            type: res.licensetype,
                            yearlyprice: res.yearlyprice,
                            monthlyprice: res.monthlyprice,
                            dailyprice: res.dailyprice,
                            currency: res.currency,
                            isdaily: res.isdaily,
                            ismonthly: res.ismonthly,
                            isyearly: res.isyearly,
                            duration: res.duration,
                            maxusers: res.maxusers
                        };
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
                    retVal.Message = 'License Type is empty.';
                    break;
                case 2:
                    retVal.Message = 'Invalid license type information provided.';
                    break;
                default:
                    retVal.Result = result;
                    break;
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }
}

export let LicenseDBHandle = new LicenseDBHandler();