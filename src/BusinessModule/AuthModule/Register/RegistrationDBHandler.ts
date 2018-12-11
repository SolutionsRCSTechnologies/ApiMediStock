import { MongoClient, Db, ObjectID } from 'mongodb';
import { Guid } from 'guid-typescript';

import { DBConfig, MainDBCollection } from '../../../DBModule/DBConfig';
import { DBClient } from '../../../DBModule/DBClient';
import { DBConfigEntity, MethodResponse } from '../../../CommonModule/Entities';
import { isRegExp } from 'util';
import { RegistrationDetail, User } from '../../../CommonModule/DBEntities';
import { ObjectId } from 'bson';

class RegistrationDBHandler {

    async CheckExistingUserId(userid) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        let errorCode: number = 0;
        let result: boolean = false;
        try {
            if (userid) {
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                console.log(userid);
                await db.collection(MainDBCollection.Users).findOne({ userid: userid }).then(res => {
                    result = res != null ? true : false;
                }).catch(err => {
                    throw err;
                });
            } else {
                errorCode = 1;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 1:
                    retVal.Message = 'Empty user id.';
                    break;
                case 2:
                    retVal.Message = 'User id is not available, it is already in use.';
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
        let result = null;
        let mClient: MongoClient;
        let errorCode: number = 0;
        //retVal.Result = result;
        try {
            if (userInfo) {
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Users).insertOne(userInfo).then(val => {
                    if (val && val.insertedCount > 0) {
                        result = {
                            userid: userInfo.UserId,
                            personid: userInfo.PersonId
                        };
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
            throw e;
            //retVal.ErrorCode = 3;
            //retVal.Message = e.message;
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
            throw e;
            //console.log(e);
            //retVal.Message = e.message;
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
                let ownerRefId: string = null;
                let licResult = null;
                let config = DBConfig;

                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                console.log('ownerid : ' + ownerid);
                await db.collection(MainDBCollection.Registrations).findOne({ ownerid: ownerid, active: 'Y' }).then(res => {
                    if (res) {
                        result = res;
                        //console.log('res : ' + res);
                    }
                }).catch(err => {
                    throw err;
                });
                if (result) {
                    licenseId = result.licid;
                    ownerRefId = result.ownerrefid;
                    if (licenseId) {
                        await db.collection(MainDBCollection.Licenses).findOne({ licid: licenseId, active: 'Y' }).then(res => {
                            if (res) {
                                licResult = res;
                            }
                        }).catch(err => {
                            throw err;
                        });
                        if (licResult) {
                            console.log(licResult);
                            if (licResult && licResult.ownerid == ownerid) {
                                if (!result.users) {
                                    result.users = [];
                                }
                                let activeUserCount = 0;
                                // result.users.forEach(ele => {
                                //     if (ele && ele.active == 'Y') {
                                //         activeUserCount++;
                                //     }
                                // });
                                await db.collection(MainDBCollection.Users).find({ ownerrefid: ownerRefId, active: 'Y' }).toArray().then(res => {
                                    if (res && res.length > 0) {
                                        activeUserCount = res.length;
                                    }
                                })
                                if (!(licResult.maxuser > activeUserCount)) {
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

    async AddNewUserInRegistration(ownerrefid: string, updatedusers: string[]) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient;
        let errorCode: number = 0;
        try {
            if (ownerrefid && updatedusers) {
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Registrations).updateOne({ ownerrefid: ownerrefid, active: 'Y' },
                    { $set: { users: updatedusers } }, { upsert: true }).then(res => {
                        console.log(res.result);
                        if (!(res.modifiedCount > 0)) {
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
            console.log('Error Code: ' + errorCode);
            switch (errorCode) {
                case 1:
                    retVal.Message = 'User is not added successfully.';
                    break;
                case 2:
                    retVal.Message = 'Invalid input to add user.';
                    break;
                default:
                    retVal.Result = updatedusers;
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

    async ActivateUser(ownerid: string, userid: string, activate: boolean) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        let errorCode: number = 0;
        let result = null;
        let fResult = null;
        try {
            if (ownerid) {
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Registrations).findOne({ ownerid: ownerid, active: 'Y' }).then(res => {
                    if (res) {
                        result = res;
                    } else {
                        errorCode = 2;
                    }
                }).catch(err => {
                    throw err;
                });
                if (result) {
                    let users = result.users;
                    let ownerrefid = result.ownerrefid;
                    let licid = result.licid;

                    if (users && users.length > 0) {
                        if (userid) {
                            let isValid = false;
                            let maxusercount = 0;
                            for (let i = 0; i < users.length; i++) {
                                if (userid == users[i]) {
                                    isValid = true;
                                }
                                await db.collection(MainDBCollection.Users).findOne({ personid: users[i] }).then(res => {
                                    if (res) {
                                        if (res.active == 'Y') {
                                            maxusercount++;
                                        }
                                    }
                                }).catch(err => {
                                    throw err;
                                });
                            }
                            if (isValid) {
                                let active = 'N';
                                let isAllowed = false;
                                if (activate) {
                                    active = 'Y';
                                    //Check for exixting license and max user count
                                    if (licid) {
                                        await db.collection(MainDBCollection.Licenses).findOne({ licid: licid, active: 'Y' }).then(res => {
                                            if (res) {
                                                if (maxusercount < res.maxusercount) {
                                                    isAllowed = true;
                                                } else {
                                                    isAllowed = false;
                                                }
                                            } else {
                                                isAllowed = false;
                                            }
                                        }).catch(err => {
                                            throw err;
                                        });
                                    }
                                } else {
                                    active = 'N';
                                }
                                if (isAllowed) {
                                    await db.collection(MainDBCollection.Users).findOneAndUpdate({ userid: userid, ownerrefid: ownerrefid },
                                        { $set: { active: active } },
                                        { sort: { updatedat: 1 }, upsert: true, returnOriginal: false }).then(res => {
                                            if (res.lastErrorObject) {
                                                errorCode = 5;
                                            } else {
                                                fResult = res.value;
                                            }
                                        }).catch(err => {
                                            throw err;
                                        });
                                } else {
                                    errorCode = 6;
                                }
                            }
                        } else {
                            errorCode = 4;
                        }
                    } else {
                        errorCode = 3;
                    }
                } else {
                    errorCode = 2;
                }
            } else {
                errorCode = 1;
            }
            retVal.ErrorCode = errorCode;
            switch (errorCode) {
                case 1:
                    retVal.Message = 'Owner id is empty.';
                    break;
                case 2:
                    retVal.Message = 'No registration information found.';
                    break;
                case 3:
                    retVal.Message = 'No user is registered yet.';
                    break;
                case 4:
                    retVal.Message = 'User id is not provided.';
                    break;
                case 5:
                    retVal.Message = 'No user is available with this id.';
                    break;
                case 6:
                    retVal.Message = 'User limit reached, license needs to be upgraded.';
                    break;
                default:
                    retVal.Result = fResult;
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

    async UpdateCollectionStatus(ownerid: string, licid: string, stat: string) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        try {
            if (ownerid && licid && ownerid.length > 0 && licid.length > 0) {
                let status: string = 'N';
                switch (stat) {
                    case 'S':
                    case 'Y':
                    case 'P':
                        status = stat;
                        break;
                    default:
                        status = 'N';
                        break;
                }
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                retVal.Result = false;
                await db.collection(MainDBCollection.Registrations).findOneAndUpdate({ ownerid: ownerid, licid: licid, active: 'Y', licensed: 'Y' },
                    { $set: { collectioncreated: status } }).then(res => {
                        if (res && res.value) {
                            console.log('Status updated');
                            retVal.Result = true;
                        }
                    }).catch(err => {
                        throw err;
                    });
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Information is not present.';
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

    async UpdateUserDBName(ownerid: string, licid: string, dbName: string, dbUrl: string) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        try {
            if (ownerid && licid && dbName && ownerid.length > 0 && licid.length > 0 && dbName.length > 0) {
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Registrations).findOneAndUpdate({ ownerid: ownerid, licid: licid, active: 'Y', licensed: 'Y' },
                    { $set: { userdbname: dbName, userdburl: dbUrl } }).then(res => {
                        if (res && res.value) {
                            console.log('Status updated');
                        }
                    }).catch(err => {
                        throw err;
                    });
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Provided information is not correct.';
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

    async UpdateLicenseStatus(ownerid: string, licid: string, isLicensed: boolean) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        try {
            if (ownerid && licid && ownerid.length > 0 && licid.length > 0) {
                let status: string = 'N';
                if (isLicensed) {
                    status = 'Y';
                }
                let ownerRefID: string = '';
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                retVal.Result = false;
                await db.collection(MainDBCollection.Registrations).findOneAndUpdate({ ownerid: ownerid, licid: licid, active: 'Y' },
                    { $set: { licensed: status } }).then(res => {
                        if (res.ok == 1) {
                            ownerRefID = res.value ? res.value.ownerrefid : '';
                            console.log(res.value);
                            retVal.Result = true;
                        }
                    }).catch(err => {
                        throw err;
                    });
                if (ownerRefID && ownerRefID.length > 0) {
                    await db.collection(MainDBCollection.Users).updateMany({ ownerrefid: ownerRefID, active: 'Y' }, { $set: { licensed: status } }, { upsert: true }).then(res => {
                        if (res.modifiedCount > 0) {
                            retVal.Result = true;
                        }
                    })
                } else {
                    retVal.ErrorCode = 2;
                    retVal.Message = '';
                }
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'Information is not present.';
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

    async GetOwnerRegistrationInfo(ownerId: string) {
        let retVal: MethodResponse = new MethodResponse();
        let mClient: MongoClient = null;
        let errorCode: number = 0;
        let result: any = null;
        try {
            if (ownerId && ownerId.length > 0) {
                let config = DBConfig;
                let isOwner: boolean = false;
                let ownerrefid: string = '';
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                await db.collection(MainDBCollection.Users).findOne({ userid: ownerId, usertype: 'OWNER', active: 'Y' }).then(res => {
                    if (res) {
                        isOwner = true;
                        ownerrefid = res.ownerrefid;
                    } else {
                        errorCode = 2;
                    }
                }).catch(err => {
                    throw err;
                });
                if (isOwner && ownerrefid && ownerrefid.length > 0) {
                    await db.collection(MainDBCollection.Registrations).findOne({ ownerid: ownerId, ownerrefid: ownerrefid, active: 'Y' }).then(res => {
                        if (res) {
                            result = {
                                ownerid: res.ownerid,
                                licid: res.licid,
                                licensed: res.licensed,
                                emailid: res.emailid,
                                maxusercount: res.maxusercount,
                                dbname: res.userdbname,
                                dburl: res.userdburl,
                                isdbcreated: res.isdbcreated
                            };
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
                    retVal.Message = 'Owner id is empty.';
                    break;
                case 2:
                    retVal.Message = 'Owner not found, provided user is not a owner.';
                    break;
                case 3:
                    retVal.Message = 'There is active registration for this owner.';
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

    async UpdateLicenseIdInRegistration(ownerId: string, licId: string, maxusers?: number) {
        let retVal: MethodResponse = new MethodResponse();
        let errorCode: number = 0;
        let mClient: MongoClient = null;
        let result: any = null;
        try {
            if (ownerId && ownerId.length > 0 && licId && licId.length > 0) {
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db: Db = await mClient.db(config.MainDBName);
                maxusers = maxusers ? maxusers : 0;
                console.log(ownerId + " " + licId);
                await db.collection(MainDBCollection.Registrations).findOneAndUpdate({ ownerid: ownerId, active: 'Y' },
                    { $set: { licid: licId, maxusercount: maxusers } }, { upsert: true }).then(res => {
                        if (res.ok > 0) {
                            result = true;
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
                    retVal.Message = 'Empty owner id or license id.';
                    break;
                case 2:
                    retVal.Message = 'Some error occurred during license id update in registration table.';
                    break;
                default:
                    retVal.Result = result;
                    break;
            }
            console.log(errorCode + " : " + retVal.Message);
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

export let RegistrationDBHandle = new RegistrationDBHandler();