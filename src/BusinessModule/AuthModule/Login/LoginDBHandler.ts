import { MongoClient, Db } from 'mongodb';
import { Guid } from 'guid-typescript';

import { DBConfig } from '../../../DBModule/DBConfig';
import { DBClient } from '../../../DBModule/DBClient';
import { DBConfigEntity } from '../../../CommonModule/Entities';

class LoginDBHandler {



    async Login(userName: string, password: string) {
        let retVal = null;
        let userlicdb = null;
        let mClient: MongoClient;
        let hasActiveSession: boolean;
        let hasMoreUsers: boolean;
        //let retEntity:DBConfigEntity;
        try {
            let config = DBConfig;
            let item: any = null;
            let user: any = null;
            mClient = await DBClient.GetMongoClient(DBConfig);
            let db: Db = await mClient.db(config.MainDBName);
            userName = userName ? userName.trim() : null;
            if (userName) {
                userlicdb = await this.CheckActiveSessionByUserName(userName);
                if (userlicdb) {
                    hasActiveSession = true;
                    retVal = {
                        username: userlicdb.username,
                        userdb: userlicdb.userdb,
                        maindb: userlicdb.maindb,
                        sessionid: userlicdb.sessionid,
                        startat: userlicdb.startat,
                        endat: userlicdb.endat
                    };
                } else {
                    hasActiveSession = false;
                    await db.collection("Users").find({ "username": userName, "password": password, "active": "Y" }).toArray().then(items => {
                        if (items && items.length > 0) {
                            hasMoreUsers = items.length > 1;
                        }
                        if (!hasMoreUsers) {
                            item = items[0];
                            user = {
                                username: item.username,
                                //userdb: item.userdb,
                                //maindb: item.maindb,
                                licenseid: item.licenseid
                            }
                        }
                        else {
                            //TBD:
                        }
                    })
                        .catch(err => {
                            //
                        });
                    if (user) {
                        let ldb = await mClient.db("License");
                        await ldb.collection("LicenseAccess").findOne({ "licenseid": user.licenseid, "active": "Y" }).then(res => {
                            if (res) {
                                userlicdb = {
                                    username: user.username,
                                    userdb: res.userdb,
                                    maindb: res.maindb,
                                    sessionid: Guid.create().toString()
                                };
                            } else {
                                //Has no active licenses
                            }
                        })
                            .catch(err => {
                                //
                            });

                        if (userlicdb) {
                            let adb = await mClient.db(userlicdb.maindb);
                            let starttime = new Date(), elapsedtime = new Date();
                            let hours: number = starttime.getHours();
                            elapsedtime.setHours(hours + 4);
                            retVal = {
                                username: userlicdb.username,
                                userdb: userlicdb.userdb,
                                maindb: userlicdb.maindb,
                                sessionid: userlicdb.sessionid,
                                startat: starttime.toLocaleString(),
                                endat: elapsedtime.toLocaleString()
                            }
                            await adb.collection("ActiveSession").insertOne(retVal);
                        }
                    }
                }
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

    async CheckActiveSessionByUserName(userName: string) {
        let retVal = null;
        let mClient: MongoClient;
        let hasActiveSession: boolean;
        try {
            let config = DBConfig;
            let item: any = null;
            let user: any = null;
            mClient = await DBClient.GetMongoClient(DBConfig);
            let db: Db = await mClient.db(config.MainDBName);
            userName = userName ? userName.trim() : null;
            if (userName) {
                await db.collection("ActiveSession").find({ "username": userName }).toArray().then(items => {
                    if (items && items.length > 0) {
                        items = items.sort(sf => sf.endtime).reverse();
                        item = items ? items[0] : null;
                        if (!(item && new Date() < new Date(item.endtime))) {
                            item = null;
                            hasActiveSession = false;
                        } else {
                            hasActiveSession = true;
                        }
                    }
                })
                    .catch(err => {
                        //throw err;
                    });

                //hasActiveSession = item? true: false;

                if (hasActiveSession) {
                    retVal = {
                        username: item.username,
                        sessionid: item.sessionid,
                        userdb: item.userdb,
                        maindb: item.maindb
                    };
                } else {
                    retVal = null;
                }
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

    async CheckActiveSessionBySessionId(sessionid: string) {
        let retVal = null;
        let mClient: MongoClient;
        let hasActiveSession: boolean;
        try {
            let config = DBConfig;
            let item: any = null;
            let user: any = null;
            mClient = await DBClient.GetMongoClient(DBConfig);
            let db: Db = await mClient.db(config.MainDBName);
            sessionid = sessionid ? sessionid.trim() : null;
            if (sessionid) {
                await db.collection("ActiveSession").find({ "sessionid": sessionid }).toArray().then(items => {
                    if (items && items.length > 0) {
                        items = items.sort(sf => sf.endtime).reverse();
                        item = items ? items[0] : null;
                        if (!(item && new Date() < new Date(item.endtime))) {
                            item = null;
                            hasActiveSession = false;
                        } else {
                            hasActiveSession = true;
                        }
                    }
                })
                    .catch(err => {
                        //throw err;
                    });

                //hasActiveSession = item? true: false;

                if (hasActiveSession) {
                    retVal = {
                        username: item.username,
                        sessionid: item.sessionid,
                        userdb: item.userdb,
                        maindb: item.maindb
                    };
                } else {
                    retVal = null;
                }
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

export let LoginDBHandle = new LoginDBHandler();