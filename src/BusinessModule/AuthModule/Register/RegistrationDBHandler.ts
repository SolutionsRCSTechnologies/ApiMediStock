import { MongoClient, Db, ObjectID } from 'mongodb';
import { Guid } from 'guid-typescript';

import { DBConfig, MainDBCollection } from '../../../DBModule/DBConfig';
import { DBClient } from '../../../DBModule/DBClient';
import { DBConfigEntity } from '../../../CommonModule/Entities';
import { isRegExp } from 'util';
import { RegistrationDetail, User } from '../../../CommonModule/DBEntities';
import { ObjectId } from 'bson';

class RegistrationDBHandler {


    async CheckExistingOwnerId(reqData) {
        let retVal = false;
        let mClient: MongoClient;
        try {
            if (reqData && reqData.ownerid) {
                let ownerid = reqData.ownerid;
                if (ownerid) {
                    let config = DBConfig;
                    mClient = await DBClient.GetMongoClient(config);
                    let db: Db = await mClient.db(config.MainDBName);
                    await db.collection(MainDBCollection.Registrations).findOne({ ownerid: ownerid, active: 'Y' }).then(val => {
                        if (!val) {
                            retVal = true;
                        }
                    }).catch(err => {
                        throw err;
                    });
                    if (retVal) {
                        await db.collection(MainDBCollection.Users).findOne({ userid: ownerid, active: 'Y' }).then(val => {
                            if (!val) {
                                retVal = true;
                            }
                        }).catch(err => {
                            throw err;
                        });
                    }
                }
            }
        } catch (e) {
            throw e;
        }
        finally {
            if (mClient) {
                mClient.close();
            }
        }
        return retVal;
    }

    async InsertUserInfo(userInfo: User) {
        let retVal: ObjectID;
        let mClient: MongoClient;
        try {
            if (userInfo) {
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Users).insertOne(userInfo).then(val => {
                    if (val) {
                        retVal = val.insertedId;
                    }
                }).catch(err => {
                    throw err;
                });
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async RegisterNew(registrationInfo: RegistrationDetail) {
        let retVal: RegistrationDetail = null;
        let mClient: MongoClient;
        try {
            if (registrationInfo) {
                let config = DBConfig;
                let id: ObjectId = null;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Registrations).insertOne(registrationInfo).then(res => {
                    if (res) {
                        id = res.insertedId;
                    }
                }).catch(err => {
                    throw err;
                });
                if (id) {
                    retVal = registrationInfo;
                }
            }
        } catch (e) {
            throw e;
        }
        finally {
            if (mClient) {
                mClient.close();
            }
        }
        return retVal;
    }

    async RegisterStockist(reqData: any) {
        let retVal = null;
        let mClient: MongoClient;
        let allowRegistration = false;
        try {
            if (reqData) {
                let isRegistered: boolean = false;
                let isActive = false;
                let stockistname: string = reqData.stockistname;
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                let existingStockist = await this.CheckExistingStockist(stockistname);
                if (!existingStockist) {
                    isRegistered = false;
                    // await db.collection("RegistrationInfo").insertOne(reqData).then((onfulfiled)=>{
                    //     if(onfulfiled){
                    //         isRegistered = true;
                    //     }
                    // }, (onrejected)=>{
                    //     isRegistered = false;
                    // }).catch(err=>{
                    //     isRegistered = false;
                    // });
                } else {
                    let licenseid = existingStockist.licenseid;
                    if (licenseid) {
                        isActive = await this.CheckActiveLicense(licenseid);
                        isRegistered = true;
                    } else {
                        isRegistered = false;
                    }
                }
                if (!isRegistered) {
                    //Stoockist info not registered
                    allowRegistration = true;
                } else if (!isActive) {
                    allowRegistration = true;
                }
                if (allowRegistration) {
                    let regdoc = "";//await this.GetRegistrationInfoDoc(reqData);
                    if (regdoc) {
                        await db.collection("RegistrationInfo").insertOne(regdoc);
                    }
                } else {
                    //Registration is not allowed
                }
            } else {
                //Empty requestobj
            }

        } catch (e) {
            throw e;
        }
        return retVal;
    }
    async RegisterSalesPerson(reqData: any) {
        let retVal = null;
        try {
            //
        } catch (e) {
            throw e;
        }
        return retVal;
    }
    async CheckExistingStockist(reqData: any) {
        let retVal = null;
        try {
            //
        } catch (e) {
            throw e;
        }
        return retVal;
    }
    async CheckActiveSalesPersons(reqData: any) {
        let retVal = null;
        try {
            //
        } catch (e) {
            throw e;
        }
        return retVal;
    }
    async CheckActiveLicense(licid: any) {
        let retVal = false;
        try {

        } catch (e) {
            throw e;
        }
        return retVal;
    }
}

export let RegistrationDBHandle = new RegistrationDBHandler();