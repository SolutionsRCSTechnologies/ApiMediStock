import { MongoClient, Db } from 'mongodb';
import { Guid } from 'guid-typescript';

import { DBConfig, MainDBCollection } from '../../../DBModule/DBConfig';
import { DBClient } from '../../../DBModule/DBClient';
import { DBConfigEntity, MethodResponse } from '../../../CommonModule/Entities';
import { LoginUtilHandle } from './LoginUtilHandler';
import { isDate } from 'util';
import { ActiveSession } from '../../../CommonModule/DBEntities';
import { LicenseHandle } from '../License/LicenseHandler';

class LoginDBHandler {


    async ValidateLogin(req) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        let errorCode = 0;
        let result: ActiveSession = null;
        try {
            if (req && req.userid && req.password) {
                let userid = req.userid;
                let password = req.password;
                let isActiveSession = false;
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.ActiveSession).findOne({ userid: userid }, { sort: { endtime: -1 } }).then(async res => {
                    let response = await res;
                    if (response) {
                        let timestamp = new Date();
                        let elapsedtime = isDate(response.endtime) ? response.endtime : new Date().setFullYear(2000, 1, 1);
                        if (timestamp < elapsedtime) {
                            result = await LoginUtilHandle.GetActiveSession(response);
                            isActiveSession = true;
                        } else {
                            isActiveSession = false;
                        }
                    }
                }).catch(err => {
                    throw err;
                });
                if (!isActiveSession) {
                    let ownerrefid = null;
                    let personid = null;
                    result = new ActiveSession();
                    await db.collection(MainDBCollection.Users).findOne({ userid: userid, password: password, active: 'Y' }).then(res => {
                        if (res) {
                            personid = res.personid;
                            ownerrefid = res.ownerrefid;
                            result.OwnerRefId = res.ownerrefid;
                            result.UserId = res.userid;
                            result.UserType = res.usertype;
                            result.UserName = res.firstname + " " + res.lastname;
                        } else {
                            errorCode = 2;
                        }
                    }).catch(err => {
                        throw err;
                    });
                    if (ownerrefid) {
                        let isExistingUser = false;
                        let maxusercount = 0;
                        let licid: string;
                        await db.collection(MainDBCollection.Registrations).findOne({ ownerrefid: ownerrefid, active: 'Y', licensed: 'Y' }).then(res => {
                            if (res) {
                                maxusercount = res.maxusercount;
                                licid = res.licid;
                                if (res.users && res.users.length > 0) {
                                    for (let i = 0; i < res.users.length; i++) {
                                        if (personid == res.users[i]) {
                                            isExistingUser = true;
                                        }
                                    }
                                    if (isExistingUser) {
                                        result.UserDB = res.userdbname;
                                        result.UserDBUrl = res.userdburl;
                                    } else {
                                        errorCode = 7;
                                    }
                                } else {
                                    errorCode = 6;
                                }
                            } else {
                                errorCode = 5;
                            }
                        }).catch(err => {
                            throw err;
                        });
                        //TBD: Check for active license
                        let isActiveLicense = await LicenseHandle.ValidateLicense(licid);
                        let isPlaceAvailable = false;
                        let currenttime = new Date();
                        currenttime.setHours(-4);
                        if (maxusercount > 0) {
                            await db.collection(MainDBCollection.ActiveSession).find(
                                {
                                    ownerrefid: ownerrefid,
                                    active: 'Y',
                                    endtime: { $gte: currenttime }
                                }, { sort: { endtime: -1 } }).count().then(res => {
                                    if (res && res > 0) {
                                        isPlaceAvailable = res < maxusercount;
                                    }
                                }).catch(err => {
                                    throw err;
                                });
                        }
                        if (isPlaceAvailable && isActiveLicense && isExistingUser && result && result.UserId) {
                            result.StartTime = new Date();
                            result.EndTime = new Date();
                            result.EndTime.setHours(4);
                            result.CreatedAt = new Date();
                            result.UpdatedAt = new Date();
                            await db.collection(MainDBCollection.ActiveSession).insertOne(result).then(res => {
                                if (!(res && res.insertedCount > 0)) {
                                    errorCode = 8;
                                }
                            }).catch(err => {
                                throw err;
                            });
                        } else {
                            errorCode = 10;
                        }
                    } else {
                        //Owner not found
                        errorCode = 9;
                    }
                } else {
                    let elapsedTime = new Date();
                    let sessionid = null;
                    let userid = null;
                    if (result && result.SessionId && result.UserId) {
                        sessionid = result.SessionId;
                        userid = result.UserId;
                        elapsedTime.setHours(4);
                        await db.collection(MainDBCollection.ActiveSession).findOneAndUpdate({ sessionid: sessionid, userid: userid }, { $set: { endtime: new Date(), updatedat: new Date(), updatedby: 'SYSTEM' } }, { upsert: true }).then(res => {
                            if (res && res.lastErrorObject) {
                                errorCode = 4;
                            }
                        }).catch(err => {
                            throw err;
                        });
                    } else {
                        result = null;
                        errorCode = 3;
                    }
                }
            } else {
                errorCode = 1;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 1:
                    retVal.Message = 'Request is not valid.';
                    break;
                case 2:
                    retVal.Message = 'User not found.';
                    break;
                case 3:
                    retVal.Message = 'Already has an active session but currently not found.';
                    break;
                case 4:
                    retVal.Message = 'Already has an active session, cannot update currently.';
                    break;
                case 5:
                    retVal.Message = 'No registration information found.';
                    break;
                case 6:
                    retVal.Message = 'User is not registered.';
                    break;
                case 7:
                    retVal.Message = 'User is not registered, request owner to add user.';
                    break;
                case 8:
                    retVal.Message = 'Error occured during login.';
                    break;
                case 9:
                    retVal.Message = 'Owner not found, an owner needs to be assigned.';
                    break;
                case 10:
                    retVal.Message = 'User not found with valid registration.';
                    break;
                default:
                    retVal.Result = {
                        userid: result.UserId,
                        username: result.UserName,
                        sessionid: result.SessionId,
                        type: result.UserType
                    };
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

    async ValidateHeader(header) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        let errorCode: number = 0;
        try {
            let result = null;
            let config = DBConfig;
            mClient = await DBClient.GetMongoClient(config);
            let db: Db = await mClient.db(config.MainDBName);
            let sessionid = null;
            if (header && header.sessionid) {
                sessionid = header.sessionid;
            }
            if (sessionid) {
                await db.collection(MainDBCollection.ActiveSession).findOne({ sessionid: sessionid }).then(res => {
                    if (res) {
                        let currenttime = Date.parse(new Date().toString());
                        let endtime = 0;
                        if (isDate(res.endtime)) {
                            endtime = Date.parse(res.endtime.toString());
                        }
                        if (endtime && currenttime < endtime) {
                            result = res;
                        } else {
                            errorCode = 3;
                        }
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
                    retVal.Message = 'Header is not valid, it does not contain any session id.';
                    break;
                case 2:
                    retVal.Message = 'No active session found.';
                    break;
                case 3:
                    retVal.Message = 'Session timeout, login again.';
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

    // async Login(userName: string, password: string) {
    //     let retVal = null;
    //     let userlicdb = null;
    //     let mClient: MongoClient;
    //     let hasActiveSession: boolean;
    //     let hasMoreUsers: boolean;
    //     //let retEntity:DBConfigEntity;
    //     try {
    //         let config = DBConfig;
    //         let item: any = null;
    //         let user: any = null;
    //         mClient = await DBClient.GetMongoClient(DBConfig);
    //         let db: Db = await mClient.db(config.MainDBName);
    //         userName = userName ? userName.trim() : null;
    //         if (userName) {
    //             userlicdb = await this.CheckActiveSessionByUserName(userName);
    //             if (userlicdb) {
    //                 hasActiveSession = true;
    //                 retVal = {
    //                     username: userlicdb.username,
    //                     userdb: userlicdb.userdb,
    //                     maindb: userlicdb.maindb,
    //                     sessionid: userlicdb.sessionid,
    //                     startat: userlicdb.startat,
    //                     endat: userlicdb.endat
    //                 };
    //             } else {
    //                 hasActiveSession = false;
    //                 await db.collection("Users").find({ "username": userName, "password": password, "active": "Y" }).toArray().then(items => {
    //                     if (items && items.length > 0) {
    //                         hasMoreUsers = items.length > 1;
    //                     }
    //                     if (!hasMoreUsers) {
    //                         item = items[0];
    //                         user = {
    //                             username: item.username,
    //                             //userdb: item.userdb,
    //                             //maindb: item.maindb,
    //                             licenseid: item.licenseid
    //                         }
    //                     }
    //                     else {
    //                         //TBD:
    //                     }
    //                 })
    //                     .catch(err => {
    //                         //
    //                     });
    //                 if (user) {
    //                     let ldb = await mClient.db("License");
    //                     await ldb.collection("LicenseAccess").findOne({ "licenseid": user.licenseid, "active": "Y" }).then(res => {
    //                         if (res) {
    //                             userlicdb = {
    //                                 username: user.username,
    //                                 userdb: res.userdb,
    //                                 maindb: res.maindb,
    //                                 sessionid: Guid.create().toString()
    //                             };
    //                         } else {
    //                             //Has no active licenses
    //                         }
    //                     })
    //                         .catch(err => {
    //                             //
    //                         });

    //                     if (userlicdb) {
    //                         let adb = await mClient.db(userlicdb.maindb);
    //                         let starttime = new Date(), elapsedtime = new Date();
    //                         let hours: number = starttime.getHours();
    //                         elapsedtime.setHours(hours + 4);
    //                         retVal = {
    //                             username: userlicdb.username,
    //                             userdb: userlicdb.userdb,
    //                             maindb: userlicdb.maindb,
    //                             sessionid: userlicdb.sessionid,
    //                             startat: starttime.toLocaleString(),
    //                             endat: elapsedtime.toLocaleString()
    //                         }
    //                         await adb.collection("ActiveSession").insertOne(retVal);
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     catch (e) {
    //         throw e;
    //     }
    //     finally {
    //         if (mClient) {
    //             mClient.close();
    //         }
    //     }
    //     return retVal;
    // }

    // async CheckActiveSessionByUserName(userName: string) {
    //     let retVal = null;
    //     let mClient: MongoClient;
    //     let hasActiveSession: boolean;
    //     try {
    //         let config = DBConfig;
    //         let item: any = null;
    //         let user: any = null;
    //         mClient = await DBClient.GetMongoClient(DBConfig);
    //         let db: Db = await mClient.db(config.MainDBName);
    //         userName = userName ? userName.trim() : null;
    //         if (userName) {
    //             await db.collection("ActiveSession").find({ "username": userName }).toArray().then(items => {
    //                 if (items && items.length > 0) {
    //                     items = items.sort(sf => sf.endtime).reverse();
    //                     item = items ? items[0] : null;
    //                     if (!(item && new Date() < new Date(item.endtime))) {
    //                         item = null;
    //                         hasActiveSession = false;
    //                     } else {
    //                         hasActiveSession = true;
    //                     }
    //                 }
    //             })
    //                 .catch(err => {
    //                     //throw err;
    //                 });

    //             //hasActiveSession = item? true: false;

    //             if (hasActiveSession) {
    //                 retVal = {
    //                     username: item.username,
    //                     sessionid: item.sessionid,
    //                     userdb: item.userdb,
    //                     maindb: item.maindb
    //                 };
    //             } else {
    //                 retVal = null;
    //             }
    //         }
    //     }
    //     catch (e) {
    //         throw e;
    //     }
    //     finally {
    //         if (mClient) {
    //             mClient.close();
    //         }
    //     }
    //     return retVal;
    // }

    // async CheckActiveSessionBySessionId(sessionid: string) {
    //     let retVal = null;
    //     let mClient: MongoClient;
    //     let hasActiveSession: boolean;
    //     try {
    //         let config = DBConfig;
    //         let item: any = null;
    //         let user: any = null;
    //         mClient = await DBClient.GetMongoClient(DBConfig);
    //         let db: Db = await mClient.db(config.MainDBName);
    //         sessionid = sessionid ? sessionid.trim() : null;
    //         if (sessionid) {
    //             await db.collection("ActiveSession").find({ "sessionid": sessionid }).toArray().then(items => {
    //                 if (items && items.length > 0) {
    //                     items = items.sort(sf => sf.endtime).reverse();
    //                     item = items ? items[0] : null;
    //                     if (!(item && new Date() < new Date(item.endtime))) {
    //                         item = null;
    //                         hasActiveSession = false;
    //                     } else {
    //                         hasActiveSession = true;
    //                     }
    //                 }
    //             })
    //                 .catch(err => {
    //                     //throw err;
    //                 });

    //             //hasActiveSession = item? true: false;

    //             if (hasActiveSession) {
    //                 retVal = {
    //                     username: item.username,
    //                     sessionid: item.sessionid,
    //                     userdb: item.userdb,
    //                     maindb: item.maindb
    //                 };
    //             } else {
    //                 retVal = null;
    //             }
    //         }
    //     }
    //     catch (e) {
    //         throw e;
    //     }
    //     finally {
    //         if (mClient) {
    //             mClient.close();
    //         }
    //     }
    //     return retVal;
    // }
}

export let LoginDBHandle = new LoginDBHandler();