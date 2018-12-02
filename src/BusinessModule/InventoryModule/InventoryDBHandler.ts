import { MongoClient, Db } from 'mongodb';

import { DBConfigEntity } from '../../CommonModule/Entities';
import { DBConfig } from '../../DBModule/DBConfig';
import { DBClient } from '../../DBModule/DBClient';
import { v4 } from 'uuid';

class InventoryDBHandler{
    private uuidv4 = v4;

    // Method to insert new data

    async SetInventoryTypeList(reqData:any[], config:DBConfigEntity){
        let retVal:any;
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
                await db.collection("inventoryType").insertMany(reqData).then(
                    res => {
                        retVal = "1 Product Successfully Inserted";
                    },
                    err =>{
                        retVal = err.errmsg;
                        console.log('err.errmsg');
                        console.log(err.errmsg);
                    }
                );
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
            element._id = element.productName.trim().replace(" ","_");
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

                    let dltquery = { productId: productNameobj.productId };
                    db.collection("inventoryType").deleteOne(dltquery).then(res => {
                        console.log(res);
                    });

                    // db.collection("inventoryType").updateOne(
                    //     { "productId" : productNameobj.productId },
                    //     { $set: { "Status": "N"} }
                    //  ).then(
                    //     res => {
                    //         console.log(res);
                    //         retVal = res;
                    //     }
                    // );;
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
        let noofUpdate:any = 0;
        try{
            if(productobj){
                //let config:DBConfigEntity = DBConfig;
                mClient = await DBClient.GetMongoClient(config);
                let db:Db = await mClient.db(config.UserDBName);
                console.log("productobj");
                console.log(productobj);

                for(let i=0;i<productobj.length;i++){
                    await db.collection("inventoryType").updateOne(
                        { "productId" : productobj[i].productId },
                        { $set: { "companyName": productobj[i].companyName,
                        "basecutOff": productobj[i].basecutOff ,
                        "updatedDate": new Date(),
                        "updatedBy":"Sourav C"} }
                     ).then(
                        res => {
                            //retVal = res;
                            console.log('res.result.nModified');
                            console.log(res.result.nModified);
                            noofUpdate = noofUpdate + res.result.nModified;
                            //retVal = res.result.nModified + "product"+ " updated";
                        }
                    );
                }

                // productobj.forEach(async item => 
                  
                // );

                    
                // db.collection("inventoryType").deleteMany(myquery, function(err, obj) {
                //     if (err) throw err;
                //     console.log("1 document deleted");
                // });
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
        retVal = noofUpdate + "Updated";
        return retVal;
    }

    //List of Inventory Product Type

     async GetInventoryTypeList(listObj:any, config:DBConfigEntity){
        let retdataVal:any;
        let Count:number;
        let mClient:MongoClient;

        let retVal = {
            "res" : retdataVal,
            "Count" : Count
        }

        try{
            //if(listObj){
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

                // await db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).skip(0*2).limit(2).toArray(function(err,docs) {
                //     console.log(docs);
                //     console.log("First two");
                //     retVal = docs; 
                // });

                await db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).skip(0*2).limit(20).toArray().then(res=>{
                    retVal.res = res;
                }).catch(err=>{
                    console.log(err);
                });

                await db.collection("inventoryType").find({}).count().then(res=>{
                    retVal.Count = res;
                }).catch(err=>{
                    console.log(err);
                });

                // db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).skip(1*2).limit(2).toArray(function(err,docs) {
                //     console.log(docs);
                //     console.log("Second two");
                // });

                // db.collection("inventoryType").find({}, {"sort" : ['updatedDate', 'asc']} ).skip(2*2).limit(2).toArray(function(err,docs) {
                //     console.log(docs);
                //     console.log("Third two");
                // });

           // }
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