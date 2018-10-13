import { RegistrationDetail, User } from '../../../CommonModule/DBEntities';

class RegisterUtilHandler {
    async GetRegistrationInfoDoc(reqData) {
        let retVal: RegistrationDetail = null;
        try {
            if (reqData) {
                retVal = new RegistrationDetail();
                if (reqData.ownerid) {
                    retVal.OwnerId = reqData.ownerid;
                }
                if (reqData.ownerfirstname) {
                    retVal.OwnerFirstName = reqData.ownerfirstname;
                }
                if (reqData.ownermiddlename) {
                    retVal.OwnerMiddleName = reqData.ownermiddlename;
                }
                if (reqData.ownerlastname) {
                    retVal.OwnerLastName = reqData.ownerlastname;
                }
                if (reqData.mobileno) {
                    retVal.MobileNo = reqData.mobileno;
                }
                if (reqData.druglicense) {
                    retVal.DrugLicense = reqData.druglicense;
                }
                if (reqData.emailid) {
                    retVal.EmailId = reqData.emailid;
                }
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async GetRegistrationInfoFromDBEntity(reqData) {
        let retVal: RegistrationDetail = null;
        try {
            if (reqData) {
                retVal = new RegistrationDetail();
                if (reqData.ownerid) {
                    retVal.OwnerId = reqData.ownerid;
                }
                if (reqData.ownerfirstname) {
                    retVal.OwnerFirstName = reqData.ownerfirstname;
                }
                if (reqData.ownermiddlename) {
                    retVal.OwnerMiddleName = reqData.ownermiddlename;
                }
                if (reqData.ownerlastname) {
                    retVal.OwnerLastName = reqData.ownerlastname;
                }
                if (reqData.mobileno) {
                    retVal.MobileNo = reqData.mobileno;
                }
                if (reqData.druglicense) {
                    retVal.DrugLicense = reqData.druglicense;
                }
                if (reqData.druglicense) {
                    retVal.DrugLicense = reqData.druglicense;
                }
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async GetUserDoc(reqData) {
        let retVal: User = null;
        try {
            if (reqData) {
                retVal = new User();
                if (reqData.usertype) {
                    retVal.UserType = reqData.usertype;
                } else {
                    retVal.UserType = "USER";
                }
                if (reqData.firstname) {
                    retVal.FirstName = reqData.firstname;
                }
                if (reqData.middlename) {
                    retVal.MiddleName = reqData.middlename;
                }
                if (reqData.lastname) {
                    retVal.LastName = reqData.lastname;
                }
                if (reqData.mobileno) {
                    retVal.MobileNo = reqData.mobileno;
                }
                if (reqData.userid) {
                    retVal.UserId = reqData.userid;
                }
                if (reqData.address) {
                    retVal.Address = reqData.address;
                }
                if (reqData.password) {
                    retVal.Password = reqData.password;
                }
                if (reqData.emailid) {
                    retVal.EmailId = reqData.emailid;
                }
                if (reqData.createdby) {
                    retVal.CreatedBy = reqData.createdby;
                } else {
                    retVal.CreatedBy = "System";
                }
                if (reqData.updatedby) {
                    retVal.UpdatedBy = reqData.updatedby;
                } else {
                    retVal.UpdatedBy = "System";
                }
                retVal.CreatedAt = new Date();
                retVal.UpdatedAt = new Date();
                retVal.Active = 'Y';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async GetOwnerUserDoc(reqData) {
        let retVal: User = null;
        try {
            if (reqData) {
                retVal = new User();
                retVal.UserType = "OWNER";
                if (reqData.ownerfirstname) {
                    retVal.FirstName = reqData.ownerfirstname;
                }
                if (reqData.ownermiddlename) {
                    retVal.MiddleName = reqData.ownermiddlename;
                }
                if (reqData.ownerlastname) {
                    retVal.LastName = reqData.ownerlastname;
                }
                if (reqData.mobileno) {
                    retVal.MobileNo = reqData.mobileno;
                }
                if (reqData.ownerid) {
                    retVal.UserId = reqData.ownerid;
                }
                if (reqData.address) {
                    retVal.Address = reqData.address;
                }
                if (reqData.password) {
                    retVal.Password = reqData.password;
                }
                if (reqData.emailid) {
                    retVal.EmailId = reqData.emailid;
                }
                if (reqData.createdby) {
                    retVal.CreatedBy = reqData.createdby;
                } else {
                    retVal.CreatedBy = "System";
                }
                if (reqData.updatedby) {
                    retVal.UpdatedBy = reqData.updatedby;
                } else {
                    retVal.UpdatedBy = "System";
                }
                retVal.CreatedAt = new Date();
                retVal.UpdatedAt = new Date();
                retVal.Active = 'Y';
                retVal.Licensed = 'N';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async GetSalePersons(users: any[]) {
        let retVal: User[] = [];
        try {
            if (users && users.length > 0) {
                let userInfo: User;
                for (let index = 0; index < users.length; index++) {
                    if (users[index]) {
                        //Validate user data
                        userInfo = await this.GetUserDoc(users[index]);
                        retVal.push(userInfo);
                    }
                }
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    // SetUserDataBase(userDBName: string) {
    //     let isSuccessful = false;
    //     if (userDBName && userDBName.length > 0 && userDBName.length < 11) {

    //     }
    //     return isSuccessful;
    // }
}

export let RegisterUtilHandle = new RegisterUtilHandler();