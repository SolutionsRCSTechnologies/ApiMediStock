import { MongoClient, Db, ObjectID } from 'mongodb';
import { Guid } from 'guid-typescript';

import { DBConfig, MainDBCollection } from '../../../DBModule/DBConfig';
import { DBClient } from '../../../DBModule/DBClient';
import { DBConfigEntity, MethodResponse } from '../../../CommonModule/Entities';
import { isRegExp } from 'util';
import { RegistrationDetail, User } from '../../../CommonModule/DBEntities';
import { ObjectId } from 'bson';

class RegistrationDBHandler {


    async CheckExistingOwnerId(reqData) {
        let retVal: MethodResponse = new MethodResponse();
        let result = false;
        let mClient: MongoClient;
        let errorCode: number = 0;
        try {
            if (reqData && reqData.ownerid) {
                let ownerid = reqData.ownerid;
                if (ownerid) {
                    let config = DBConfig;
                    mClient = await DBClient.GetMongoClient(config);
                    let db: Db = await mClient.db(config.MainDBName);
                    await db.collection(MainDBCollection.Registrations).findOne({ ownerid: ownerid, active: 'Y' }).then(val => {
                        if (!val) {
                            result = true;
                        } else {
                            errorCode = 2;
                        }
                    }).catch(err => {
                        throw err;
                    });
                    if (result) {
                        await db.collection(MainDBCollection.Users).findOne({ userid: ownerid, active: 'Y' }).then(val => {
                            if (!val) {
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
            } else {
                errorCode = 1;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 1:
                    retVal.Message = 'Owner id cannot be empty.'
                    break;
                case 2:
                    retVal.Message = 'This id is already registered and active.';
                    break;
                case 3:
                    retVal.Message = 'This id is already in use as an user, cannot be used for owner id.';
                    break;
                default:
                    retVal.Result = result;
                    break;
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
        let retVal: MethodResponse = new MethodResponse();
        let result: string;
        let mClient: MongoClient;
        let errorCode: number = 0;
        try {
            if (userInfo) {
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Users).insertOne(userInfo).then(val => {
                    if (val && val.insertedId) {
                        result = userInfo.PersonId;
                    } else {
                        errorCode = 2;
                    }
                }).catch(err => {
                    throw err;
                });
            } else {
                //Empty userinfo response
                errorCode = 1
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 1:
                    retVal.Message = 'User information is empty.';
                    break;
                case 2:
                    retVal.Message = 'User is not registered.';
                    break;
                default:
                    retVal.Result = result;
                    break;
            }
        } catch (e) {
            //throw e;
            retVal.ErrorCode = 3;
            retVal.Message = e.message;
        }
        finally {
            if (mClient) {
                mClient.close();
            }
        }
        return retVal;
    }

    async RegisterOwner(registrationInfo: RegistrationDetail) {
        let retVal: MethodResponse = new MethodResponse();
        let result: RegistrationDetail = null;
        let mClient: MongoClient;
        let errorCode: number = 0;
        try {
            if (registrationInfo) {
                let config = DBConfig;
                let id: string = null;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Registrations).insertOne(registrationInfo).then(res => {
                    if (res && res.insertedId) {
                        id = registrationInfo.RegId;
                    } else {
                        errorCode = 2;
                    }
                }).catch(err => {
                    throw err;
                });
                if (id) {
                    result = registrationInfo;
                } else {
                    errorCode = 2;
                }
            } else {
                //Empty response
                errorCode = 1;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 1:
                    retVal.Message = 'Empty registration inforation.';
                    break;
                case 2:
                    retVal.Message = 'Registration failed.';
                    break;
                default:
                    retVal.Result = result;
                    break;
            }
        } catch (e) {
            //throw e;
            console.log(e);
            retVal.Message = e.message;
        }
        finally {
            if (mClient) {
                mClient.close();
            }
        }
        return retVal;
    }

    async GetRegistrationDetail(ownerid: string) {
        let retVal = new MethodResponse();
        let mClient: MongoClient;
        let errorCode = 0;
        let result = null;
        try {
            if (ownerid && ownerid.length > 0) {
                //
                let licenseId: string = null;
                let licResult = null;
                let config = DBConfig;

                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Registrations).findOne({ ownerid: ownerid, active: 'Y' }).then(res => {
                    if (res) {
                        result = res;
                    }
                }).catch(err => {
                    throw err;
                });
                if (result) {
                    licenseId = result.licid;
                    if (licenseId) {
                        await db.collection(MainDBCollection.Licenses).findOne({ licid: licenseId, active: 'Y' }).then(res => {
                            if (res) {
                                licResult = res;
                            }
                        }).catch(err => {
                            throw err;
                        });
                        if (licResult) {
                            if (licResult && licResult.licid && licResult.active == 'Y' && licResult.ownerrefid == result.ownerrefid) {
                                if (!result.users) {
                                    result.users = [];
                                }
                                let activeUserCount = 0;
                                result.users.forEach(ele => {
                                    if (ele && ele.active == 'Y') {
                                        activeUserCount++;
                                    }
                                });
                                if (!(licResult.maxusercount > activeUserCount)) {
                                    errorCode = 5;
                                }
                            } else {
                                errorCode = 4;
                            }
                        }
                    } else {
                        //Not licensed
                        errorCode = 3;
                    }
                } else {
                    errorCode = 2;
                }
            } else {
                //
                errorCode = 1;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 1:
                    retVal.Message = 'Owner id is not valid.';
                    break;
                case 2:
                    retVal.Message = 'No registration information found.';
                    break;
                case 3:
                    retVal.Message = 'License is not assigned to the registered owner.';
                    break;
                case 4:
                    retVal.Message = 'License is not matching.';
                    break;
                case 5:
                    retVal.Message = 'No more user can attach to this license type, need to upgrade the license.';
                    break;
                default:
                    retVal.Result = result;
                    break;
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

    async AddNewUserInRegistration(ownerid: string, newuserid: string, updatedusers: string[]) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        let errorCode: number = 0;
        try {
            if (ownerid && updatedusers && newuserid) {
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Registrations).updateOne({ ownerid: ownerid, active: 'Y', licensed: 'Y' },
                    { $set: { users: updatedusers } }).then(res => {
                        if (res && res.modifiedCount < 1) {
                            errorCode = 1;
                        }
                    }).catch(err => {
                        throw err;
                    });
            } else {
                //Invalid input
                errorCode = 2;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 1:
                    retVal.Message = 'User is not added successfully.';
                    break;
                case 2:
                    retVal.Message = 'Invalid input to add user.';
                    break;
                default:
                    retVal.Result = newuserid;
                    break;
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

    // async RegisterStockist(reqData: any) {
    //     let retVal = null;
    //     let mClient: MongoClient;
    //     let allowRegistration = false;
    //     try {
    //         if (reqData) {
    //             let isRegistered: boolean = false;
    //             let isActive = false;
    //             let stockistname: string = reqData.stockistname;
    //             let config = DBConfig;
    //             mClient = await DBClient.GetMongoClient(config);
    //             let db: Db = await mClient.db(config.MainDBName);
    //             let existingStockist = await this.CheckExistingStockist(stockistname);
    //             if (!existingStockist) {
    //                 isRegistered = false;
    //                 // await db.collection("RegistrationInfo").insertOne(reqData).then((onfulfiled)=>{
    //                 //     if(onfulfiled){
    //                 //         isRegistered = true;
    //                 //     }
    //                 // }, (onrejected)=>{
    //                 //     isRegistered = false;
    //                 // }).catch(err=>{
    //                 //     isRegistered = false;
    //                 // });
    //             } else {
    //                 let licenseid = existingStockist.licenseid;
    //                 if (licenseid) {
    //                     isActive = await this.CheckActiveLicense(licenseid);
    //                     isRegistered = true;
    //                 } else {
    //                     isRegistered = false;
    //                 }
    //             }
    //             if (!isRegistered) {
    //                 //Stoockist info not registered
    //                 allowRegistration = true;
    //             } else if (!isActive) {
    //                 allowRegistration = true;
    //             }
    //             if (allowRegistration) {
    //                 let regdoc = "";//await this.GetRegistrationInfoDoc(reqData);
    //                 if (regdoc) {
    //                     await db.collection("RegistrationInfo").insertOne(regdoc);
    //                 }
    //             } else {
    //                 //Registration is not allowed
    //             }
    //         } else {
    //             //Empty requestobj
    //         }

    //     } catch (e) {
    //         throw e;
    //     }
    //     return retVal;
    // }

    // async RegisterSalesPerson(reqData: any) {
    //     let retVal = null;
    //     try {
    //         //
    //     } catch (e) {
    //         throw e;
    //     }
    //     return retVal;
    // }
    // async CheckExistingStockist(reqData: any) {
    //     let retVal = null;
    //     try {
    //         //
    //     } catch (e) {
    //         throw e;
    //     }
    //     return retVal;
    // }
    // async CheckActiveSalesPersons(reqData: any) {
    //     let retVal = null;
    //     try {
    //         //
    //     } catch (e) {
    //         throw e;
    //     }
    //     return retVal;
    // }
    // async CheckActiveLicense(licid: any) {
    //     let retVal = false;
    //     try {

    //     } catch (e) {
    //         throw e;
    //     }
    //     return retVal;
    // }
}

export let RegistrationDBHandle = new RegistrationDBHandler();