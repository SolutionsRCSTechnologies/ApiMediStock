import { MongoClient, Db } from 'mongodb';

import { DBConfigEntity } from '../../CommonModule/Entities';
import { DBConfig } from '../../DBModule/DBConfig';
import { DBClient } from '../../DBModule/DBClient';
import { v4 } from 'uuid';

class InventoryDBHandler{
    private uuidv4 = v4;

    // Method to insert new data

    async SetInventoryTypeList(reqData:any[], config:DBConfigEntity){
        let retVal:any[];
        let mClient:MongoClient;
        try{
            if(reqData){
                //let config:DBConfigEntity = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                //config.UserDBName = "MediStockDB";
                let db:Db = await mClient.db(config.UserDBName);
                console.log("reqData 1");
                console.log(reqData);
                reqData = this.InsertDataManupulation(reqData);
                console.log("reqData");
                console.log(reqData);
                db.collection("inventoryType").insertMany(reqData, function(err, res) {
                    console.log("err");
                    console.log(err);
                    if (err) throw err;
                    console.log("Number of documents inserted: " + res.insertedCount);
                });
            }
        }
        catch(e){
            throw e;
        }
        finally{
            if(mClient){
                mClient.close();
            }
        }
        return retVal;
    }

    //Product Id Creation

    public InsertDataManupulation(reqData:any[]){
        reqData.forEach(element => {
            element.productId = "PRO_" + this.uuidv4();
            element.createddate = new Date();
            element.createdBy = "Sourav C";
            element.updatedDate = new Date();
            element.updatedBy = "Sourav C";
            element.Status = "Y";
        });

        return reqData;
    }

    //Remove a inventory product

    async deleteInventoryTypeList(productNameobj:any, config:DBConfigEntity){
        let retVal:any;
        let mClient:MongoClient;
        try{
            if(productNameobj){
                //let config:DBConfigEntity = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db:Db = await mClient.db(config.UserDBName);
                    console.log(productNameobj.productId);
                    db.collection("inventoryType").updateOne(
                        { "productId" : productNameobj.productId },
                        { $set: { "Status": "N"} }
                     ).then(
                        res => {
                            console.log(res);
                            retVal = res;
                        }
                    );;
                // db.collection("inventoryType").deleteMany(myquery, function(err, obj) {
                //     if (err) throw err;
                //     console.log("1 document deleted");
                // });
            }
        }
        catch(e){
            throw e;
        }
        finally{
            if(mClient){
                mClient.close();
            }
        }
        return retVal;
    }

    // Update bulk product 
    async UpdateInventoryTypeList(productobj:any[], config:DBConfigEntity){
        let retVal:any;
        let mClient:MongoClient;
        try{
            if(productobj){
                //let config:DBConfigEntity = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db:Db = await mClient.db(config.UserDBName);
                console.log("productobj");
                console.log(productobj);
                productobj.forEach(item => {
                    db.collection("inventoryType").updateOne(
                        { "productId" : item.productId },
                        { $set: { "companyName": item.companyName,
                        "basecutOff": item.basecutOff ,
                        "updatedDate": new Date(),
                        "updatedBy":"Sourav C"} }
                     ).then(
                        res => {
                            console.log(res);
                            retVal = res;
                        }
                    );  
                });

                    
                // db.collection("inventoryType").deleteMany(myquery, function(err, obj) {
                //     if (err) throw err;
                //     console.log("1 document deleted");
                // });
            }
        }
        catch(e){
            throw e;
        }
        finally{
            if(mClient){
                mClient.close();
            }
        }
        return retVal;
    }

    //List of Inventory Product Type

    async GetInventoryTypeList(listObj:any, config:DBConfigEntity){
        let retVal:any[];
        let mClient:MongoClient;
        try{
            if(listObj){
                //let config:DBConfigEntity = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db:Db = await mClient.db(config.UserDBName);
                //config.UserDBName = "MediStockDB";
                // db.collection("inventoryType").find().limit(listObj.itemNo).toArray().then(res=>{
                //     retVal = res;
                // });

                // db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).toArray(function(err,docs) {
                //     console.log(docs);
                // });
                // db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).toArray(function(err,docs) {
                //     console.log(docs);
                // });

                db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).skip(0*2).limit(2).toArray(function(err,docs) {
                    console.log(docs);
                    console.log("First two");
                });

                db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).skip(1*2).limit(2).toArray(function(err,docs) {
                    console.log(docs);
                    console.log("Second two");
                });

                db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).skip(2*2).limit(2).toArray(function(err,docs) {
                    console.log(docs);
                    console.log("Third two");
                });

            }
        }
        catch(e){
            throw e;
        }
        finally{
            if(mClient){
                mClient.close();
            }
        }
        return retVal;
    }

    async InventoryTypeget(listObj:any, config:DBConfigEntity){
        let retVal:any[];
        let mClient:MongoClient;
        try{
            if(listObj){
                //let config:DBConfigEntity = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db:Db = await mClient.db(config.UserDBName);
                //config.UserDBName = "MediStockDB";
                // db.collection("inventoryType").find().limit(listObj.itemNo).toArray().then(res=>{
                //     retVal = res;
                // });

                // db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).toArray(function(err,docs) {
                //     console.log(docs);
                // });
                // db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).toArray(function(err,docs) {
                //     console.log(docs);
                // });
                let regexp = new RegExp("^"+ listObj.productName);
                db.collection("inventoryType").find({productName: regexp}).toArray().then(arr=>{
                    retVal = arr;
                    console.log(arr);
                })
                .catch(err=>{
                    throw err;
                });
            }
        }
        catch(e){
            console.log(e);
            throw e;
        }
        finally{
            if(mClient){
                mClient.close();
            }
        }
        return retVal;
    }

    

    

}

export let InventoryDBHandle = new InventoryDBHandler();