import { MongoClient, Db } from 'mongodb';
import { Guid } from 'guid-typescript';

import { DBConfig, MainDBCollection } from '../../../DBModule/DBConfig';
import { DBClient } from '../../../DBModule/DBClient';
import { DBConfigEntity } from '../../../CommonModule/Entities';
import { isRegExp  } from 'util';

class RegistrationDBHandler{
    async RegisterStockist(reqData:any){
        let retVal = null;
        let mClient:MongoClient;
        try {
            if(reqData){
                let isRegistered:boolean = false;
                let stockistname:string = reqData.stockistname;
                let config = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db:Db = await mClient.db(config.MainDBName);
                let existingStockist = await this.CheckExistingStockist(stockistname);
                if(!existingStockist){
                    await db.collection("RegistrationInfo").insertOne(reqData).then((onfulfiled)=>{
                        if(onfulfiled){
                            isRegistered = true;
                        }
                    }, (onrejected)=>{
                        isRegistered = false;
                    }).catch(err=>{
                        isRegistered = false;
                    });
                } else{
                    let licenseid = existingStockist.licenseid;
                    if(licenseid){
                        
                    }
                }
                if(!isRegistered){
                    //Stoockist info not registered
                }
            } else{
                //Empty requestobj
            }
            
        } catch (e) {
            throw e;
        }
        return retVal;
    }
    async RegisterSalesPerson(reqData:any){
        let retVal = null;
        try {
            //
        } catch (e) {
            throw e;
        }
        return retVal;
    }
    async CheckExistingStockist(reqData:any){
        let retVal = null;
        try {
            //
        } catch (e) {
            throw e;
        }
        return retVal;
    }
    async CheckActiveSalesPersons(reqData:any){
        let retVal = null;
        try {
            //
        } catch (e) {
            throw e;
        }
        return retVal;
    }
    async CheckActiveLicense(reqData:any){
        let retVal = null;
        try {
            
        } catch (e) {
            throw e;
        }
        return retVal;
    }
}

export let RegistrationDBHandle = new RegistrationDBHandler();