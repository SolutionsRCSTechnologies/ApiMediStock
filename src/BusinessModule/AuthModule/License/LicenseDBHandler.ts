import { MongoClient, Db } from 'mongodb';
import { Guid } from 'guid-typescript';

import { DBConfig, MainDBCollection } from '../../../DBModule/DBConfig';
import { DBClient } from '../../../DBModule/DBClient';
import { DBConfigEntity, MethodResponse } from '../../../CommonModule/Entities';
import { isRegExp } from 'util';
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
                    //
                }).catch(err => {
                    throw err;
                });
            }
        } catch (e) {

        } finally {
            if (mClient) {
                mClient.close();
            }
        }
        return isValid;
    }
}

export let LicenseDBHandle = new LicenseDBHandler();