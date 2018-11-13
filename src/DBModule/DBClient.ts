import { MongoClient, Server, Db } from 'mongodb'

import { DBConfigEntity } from '../CommonModule/Entities';

class DBClientAccess {
    async GetMongoClient(config: DBConfigEntity) {
        return await MongoClient.connect(config.MainDBUrl, { useNewUrlParser: true });
    }

    async CreateUserDB(url: string) {
        let isCreated: boolean = false;
        let mClient: MongoClient = null;
        try {
            if (url && url.length > 0) {
                await MongoClient.connect(url, { useNewUrlParser: true }).then(res => {
                    if (res) {
                        isCreated = true;
                        mClient = res;
                    }
                });
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
        finally {
            if (mClient) {
                mClient.close();
            }
        }
        return isCreated;
    }

    // async GetMongoDataBase(config:DBConfigEntity){
    //     let server = await new Server('localhost', 27017);
    //     let db = await new Db(config.UserDBName, server, {w:1});
    //     return db;
    // }
}

export let DBClient = new DBClientAccess();