import { MongoClient, Db } from 'mongodb';
import { Guid } from 'guid-typescript';

import { DBConfig, MainDBCollection } from '../../../DBModule/DBConfig';
import { DBClient } from '../../../DBModule/DBClient';
import { DBConfigEntity, MethodResponse } from '../../../CommonModule/Entities';
import { isRegExp, isDate } from 'util';
import { RegistrationDetail, User } from '../../../CommonModule/DBEntities';

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
}

export let LicenseDBHandle = new LicenseDBHandler();