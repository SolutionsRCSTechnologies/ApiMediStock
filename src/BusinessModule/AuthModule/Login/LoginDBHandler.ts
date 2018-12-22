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
    async Login(req: any) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        let errorCode = 0;
        let result: ActiveSession = null;
        try {
            if (req && req.userid && req.password) {
                let userid = req.userid;
                let password = req.password;
                let isActiveSession = false;
                let isValidUser: boolean = false;
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);

                await db.collection(MainDBCollection.Users).findOne({ userid: userid, active: 'Y' }).then(res => {
                    if (res) {
                        console.log('In Password: ' + password + ', DB Password: ' + res.password);
                        if (res.password && res.password == password) {
                            if (res.licensed && res.licensed == 'Y') {
                                isValidUser = true;
                            } else {
                                errorCode = 13;
                            }
                        } else {
                            errorCode = 12;
                        }
                    } else {
                        errorCode = 11;
                    }
                }).catch(err => {
                    throw err;
                });
                if (isValidUser) {
                    await db.collection(MainDBCollection.ActiveSession).findOne({ userid: userid, active: 'Y', endtime: { $gte: new Date() } }, { sort: { endtime: -1 } }).then(async res => {
                        let response = await res;
                        if (response) {
                            let timestamp = new Date();
                            let elapsedtime = isDate(response.endtime) ? response.endtime : new Date().setFullYear(2000, 1, 1);
                            if (timestamp < elapsedtime) {
                                console.log('response session: ' + response.sessionid);
                                result = await LoginUtilHandle.GetActiveSession(response);
                                result.SessionId = response.sessionid;
                                console.log('result session: ' + result.SessionId);
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
                                    if (personid == ownerrefid) {
                                        isExistingUser = true;
                                    } else {
                                        if (res.users && res.users.length > 0) {
                                            for (let i = 0; i < res.users.length; i++) {
                                                if (userid == res.users[i]) {
                                                    isExistingUser = true;
                                                }
                                            }
                                        } else {
                                            errorCode = 6;
                                        }
                                    }
                                    if (isExistingUser) {
                                        result.UserDB = res.userdbname;
                                        result.UserDBUrl = res.userdburl;
                                    } else {
                                        errorCode = 7;
                                    }
                                } else {
                                    errorCode = 5;
                                }
                            }).catch(err => {
                                throw err;
                            });
                            //Check for active license
                            let isActiveLicense = await LicenseHandle.ValidateLicense(licid);
                            console.log('Login isActiveLicense :' + isActiveLicense);
                            let isPlaceAvailable = false;
                            let currenttime = new Date();
                            let currentHours: number = currenttime.getHours();
                            currenttime.setHours(currentHours - 4);
                            if (maxusercount > 0) {
                                await db.collection(MainDBCollection.ActiveSession).find(
                                    {
                                        ownerrefid: ownerrefid,
                                        active: 'Y',
                                        endtime: { $gte: currenttime }
                                    }, { sort: { endtime: -1 } }).count().then(res => {
                                        isPlaceAvailable = res <= maxusercount;
                                    }).catch(err => {
                                        throw err;
                                    });
                            }
                            console.log('isPlaceAvailable :' + isPlaceAvailable + ' ,isActiveLicense :' + isActiveLicense + ' , isExistingUser :' + isExistingUser + ' ,result.UserId :' + result.UserId);
                            if (isPlaceAvailable && isActiveLicense && isExistingUser && result && result.UserId) {
                                result.StartTime = new Date();
                                result.EndTime = new Date();
                                let currentHours: number = result.EndTime.getHours();
                                result.EndTime.setHours(currentHours + 4);
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
                        let currentHours: number = elapsedTime.getHours();
                        let sessionid = null;
                        let userid = null;
                        if (result && result.SessionId && result.UserId) {
                            sessionid = result.SessionId;
                            userid = result.UserId;
                            elapsedTime.setHours(currentHours + 4);
                            //let dateStr: string = elapsedTime.toLocaleString();  new Date(new Date().setHours(new Date().getHours() + 4))
                            console.log('Session Id: ' + sessionid + ', user Id: ' + userid);
                            await db.collection(MainDBCollection.ActiveSession).updateOne({ sessionid: sessionid, userid: userid, active: 'Y' }, { $set: { endtime: elapsedTime, updatedat: new Date(), updatedby: 'SYSTEM' } }).then(res => {
                                if (!(res.modifiedCount > 0)) {
                                    errorCode = 4;
                                }
                            }).catch(err => {
                                console.log(err);
                                throw err;
                            });
                        } else {
                            result = null;
                            errorCode = 3;
                        }
                    }
                } else {
                    errorCode = errorCode > 0 ? errorCode : 13;
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
                case 11:
                    retVal.Message = 'Id is invalid or user is inactive.';
                    break;
                case 12:
                    retVal.Message = 'Password is invalid.';
                    break;
                case 13:
                    retVal.Message = 'User is not licensed, Please request owner to allow.';
                    break;
                default:
                    retVal.Result = {
                        userid: result.UserId,
                        username: result.UserName,
                        sessionid: result.SessionId,
                        usertype: result.UserType,
                        elapsedtime: result.EndTime,
                        userrole: result.UserRole
                    };
                    break;
            }
            console.log(retVal.Result);
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

    async ValidateHeader(header: any) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        let errorCode: number = 0;
        try {
            let result = null;
            let config = DBConfig;
            mClient = await DBClient.GetMongoClient(config);
            let db: Db = await mClient.db(config.MainDBName);
            let sessionId: string = '';
            let userId: string = '';
            if (header && header.sessionid) {
                sessionId = header.sessionid;
                userId = header.userid;
            }
            if (sessionId && sessionId.length > 0 && userId && userId.length > 0) {
                await db.collection(MainDBCollection.ActiveSession).findOne({ sessionid: sessionId, userid: userId, active: 'Y' }).then(res => {
                    if (res) {
                        let currenttime = new Date();
                        if (isDate(res.endtime) && currenttime < res.endtime) {
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
                    retVal.Result = {
                        sessionid: result.sessionid,
                        userid: result.userid,
                        elapsedtime: result.endtime,
                        usertype: result.usertype,
                        userrole: result.role,
                        username: result.username,
                        userdb: result.userdb,
                        userdburl: result.userdburl
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

    async Logout(userId: string, sessionId: string) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        let errorCode: number = 0;
        let result: any = null;
        try {
            if (userId && userId.length > 0 && sessionId && sessionId.length > 0) {
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.ActiveSession).updateOne({ userid: userId, sessionid: sessionId, active: 'Y' },
                    { $set: { active: 'N' } }).then(res => {
                        if (res.modifiedCount > 0) {
                            result = 'User is successfully logged out.'
                        } else {
                            errorCode = 2;
                            console.log('Matched Count: ' + res.matchedCount);
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
                    retVal.Message = 'User id or session id is empty.';
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
}

export let LoginDBHandle = new LoginDBHandler();