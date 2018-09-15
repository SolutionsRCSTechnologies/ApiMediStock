import { MongoClient, Server, Db } from 'mongodb'

import { DBConfigEntity } from '../CommonModule/Entities';

class DBClientAccess{
    async GetMongoClient(config:DBConfigEntity){
        return await MongoClient.connect(config.MainDBUrl, { useNewUrlParser: true});
    }

    // async GetMongoDataBase(config:DBConfigEntity){
    //     let server = await new Server('localhost', 27017);
    //     let db = await new Db(config.UserDBName, server, {w:1});
    //     return db;
    // }
}

export let DBClient = new DBClientAccess();