import { MongoClient, Db } from 'mongodb';
import { Guid } from 'guid-typescript';

import { DBConfig, MainDBCollection, UserDBCollectionArr } from '../../../DBModule/DBConfig';
import { DBClient } from '../../../DBModule/DBClient';
import { DBConfigEntity, MethodResponse } from '../../../CommonModule/Entities';
import { isRegExp, isDate } from 'util';
import { RegistrationDetail, User, LicenseDetail, LicensePurchase } from '../../../CommonModule/DBEntities';

class LicenseDBHandler {
    async ValidateLicense(licid: string) {
        let isValid: boolean = false;
        let mClient: MongoClient = null;
        try {
            if (licid) {
                let isPendingAmount: boolean = true;
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                console.log('licid :' + licid);
                await db.collection(MainDBCollection.Licenses).findOne({ licid: licid, active: 'Y' }).then(res => {
                    if (res) {
                        let currenttime: Date = new Date();
                        isValid = isDate(res.licenddate) && currenttime < res.licenddate;
                        // if (isDate(res.licenddate) && currenttime < res.licenddate) {
                        //     isValid = true;
                        // }
                        isPendingAmount = res.isamountpending && res.isamountpending == 'Y';
                        console.log('isValid :' + isValid + ' ,check :' + (isDate(res.licenddate) && currenttime < res.licenddate));
                        console.log('currenttime :' + currenttime + ' ,isPendingAmount :' + isPendingAmount + ' ,licenddate :' + res.licenddate);
                    }
                }).catch(err => {
                    throw err;
                });
                //Check for license expiry in License purchase table.
                if (isValid && isPendingAmount) {
                    await db.collection(MainDBCollection.LicensePurchase).findOne({ licid: licid, active: 'Y' }).then(res => {
                        if (res) {
                            let currentDate: Date = new Date();
                            let totalPendingAmount: number = res.totalpendingamount;
                            if (totalPendingAmount > 0) {
                                if (isDate(res.paymentcleardate) && currentDate < res.paymentcleardate) {
                                    isValid = true;
                                } else {
                                    isValid = false;
                                }
                            }
                            console.log('isValid :' + isValid + ' ,totalPendingAmount :' + totalPendingAmount + ' ,paymentcleardate :' + res.paymentcleardate);
                        }
                    }).catch(err => {
                        throw err;
                    });
                }
                console.log('isValid :' + isValid);
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

    // async CreateUserDB(dbName: string) {
    //     let isCreated: boolean = false;
    //     try {
    //         if (dbName && dbName.length > 0) {
    //             let url: string = DBConfig.UserDBUrl + '/' + dbName;
    //             isCreated = await DBClient.CreateUserDB(url);
    //         }
    //     } catch (e) {
    //         throw e;
    //     }
    //     return isCreated;
    // }

    async AssignUserDB(ownerId: string, licId: string) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        let errorCode: number = 0;
        let result: any = null;
        try {
            if (ownerId && ownerId.length > 0 && licId && licId.length > 0) {
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                let dbName: string = '';
                let dbUrl: string = '';
                let id: any = null;
                await db.collection(MainDBCollection.UserDBCollection).find({ assigned: 'N', active: 'Y' }).sort('createddate', 1).toArray().then(res => {
                    if (res && res.length > 0 && res[0] != null) {
                        dbName = res[0].dbname;
                        dbUrl = res[0].dburl;
                        id = res[0]._id;
                    } else {
                        errorCode = 2;
                    }
                }).catch(err => {
                    throw err;
                });
                console.log("id: " + id + ", dbname: " + dbName + ", dburl: " + dbUrl);
                if (errorCode == 0 && id && dbName.length > 0 && dbUrl.length > 0) {
                    await db.collection(MainDBCollection.UserDBCollection).findOneAndUpdate({ _id: id },
                        { $set: { ownerid: ownerId, licid: licId, assigned: 'Y' } }).then(res => {
                            if (res.ok == 1) {
                                result = {
                                    dbname: dbName,
                                    dburl: dbUrl,
                                    ownerid: ownerId,
                                    licid: licId
                                };
                            } else {
                                errorCode = 4;
                            }
                        }).catch(err => {
                            throw err;
                        });
                } else {
                    errorCode = errorCode > 0 ? errorCode : 3;
                }
            } else {
                errorCode = 1;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 1:
                    retVal.Message = 'Owner id or license id is empty.';
                    break;
                case 2:
                    retVal.Message = 'No database is available to assign the owner.';
                    break;
                case 3:
                    retVal.Message = 'Some error found in database name or url.';
                    break;
                case 4:
                    retVal.Message = 'Some error occurred during assignment of the database to the owner.';
                    break;
                default:
                    retVal.Result = result;
                    break;
            }
            console.log(retVal.Message);
        } catch (e) {
            throw e;
        } finally {
            if (mClient) {
                mClient.close();
            }
        }
        return retVal;
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
            console.log(errorCode);
        } catch (e) {
            console.log(e);
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
                console.log(licType);
                await db.collection(MainDBCollection.LicenseTypes).findOne({ licensetype: licType, active: 'Y' }).then(res => {
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
                            maxusers: res.maxusers,
                            minduration: res.minduration,
                            paymentclearlengthindays: res.paymentclearlengthindays
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
            console.log(errorCode + " : " + retVal.Message);
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async CreateNewLicensePurchase(licObj: LicensePurchase) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        let result: any = null;
        let errorCode: number = 0;
        try {
            if (licObj) {
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.LicensePurchase).insertOne(licObj).then(res => {
                    if (res && res.insertedCount > 0) {
                        result = licObj.LicPurId;
                    } else {
                        errorCode = 2;
                    }
                }).catch(err => {
                    throw err;
                });
                let isPendingAmount: string = 'Y';
                if (licObj.TotalPendingAmount > 0) {
                    isPendingAmount = 'Y';
                } else {
                    isPendingAmount = 'N';
                }
                await db.collection(MainDBCollection.Licenses).findOneAndUpdate({ licid: licObj.LicId, ownerid: licObj.OwnerId, active: 'Y' },
                    { $set: { isamountpending: isPendingAmount } }).then(res => {
                        if (res.ok != 1) {
                            errorCode = 3;
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
                case 3:
                    retVal.Message = 'License collection update unsuccessfull.';
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

    async UpdateUserDBNameInLicense(licId: string, ownerId: string, dbName: string, dbUrl?: string) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        let errorCode: number = 0;
        let result: any = null;
        try {
            if (licId && ownerId && dbName && licId.length > 0 && ownerId.length > 0 && dbName.length > 0) {
                dbUrl = dbUrl && dbUrl.length > 0 ? dbUrl : '';
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Licenses).findOneAndUpdate({ licid: licId, ownerid: ownerId, dbcreated: 'N' },
                    { $set: { dbcreated: 'Y', userdb: dbName, userdburl: dbUrl } }).then(res => {
                        if (res.ok == 1) {
                            result = true;
                        } else {
                            errorCode = 2;
                            console.log(res.lastErrorObject);
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
                    retVal.Message = 'Request is not valid.';
                    break;
                case 2:
                    retVal.Message = 'Some error occurred during database update.';
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

    async ChangeActiveStatusOfLicense(licId: string, isActive: boolean) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        let errorCode: number = 0;
        let result: boolean = false;
        try {
            if (licId && licId.length > 0) {
                let stat: string = isActive ? 'Y' : 'N';
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Licenses).findOneAndUpdate({ licid: licId },
                    { $set: { active: stat } }).then(res => {
                        if (!res.lastErrorObject) {
                            result = true;
                        } else {
                            errorCode = 2;
                        }
                    }).catch(err => {
                        throw err;
                    });
                if (result) {
                    await db.collection(MainDBCollection.LicensePurchase).findOneAndUpdate({ licid: licId, active: 'Y' },
                        { $set: { active: stat } }).then(res => {
                            if (!res.lastErrorObject) {
                                result = true;
                            } else {
                                errorCode = 3;
                            }
                        }).catch(err => {
                            throw err;
                        });
                }
            } else {
                errorCode = 1;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 1:
                    retVal.Message = 'Empty license id.';
                    break;
                case 2:
                    retVal.Message = 'Error occurred during license table update.';
                    break;
                case 3:
                    retVal.Message = 'Error occurred during license purchase table update.';
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

export let LicenseDBHandle = new LicenseDBHandler();