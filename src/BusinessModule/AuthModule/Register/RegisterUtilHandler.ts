import { RegistrationDetail, User } from '../../../CommonModule/DBEntities';
import { strict } from 'assert';

class RegisterUtilHandler {
    async GetRegistrationInfoDoc(reqData) {
        let retVal: RegistrationDetail = null;
        try {
            if (reqData) {
                retVal = new RegistrationDetail();
                if (reqData.ownerid) {
                    retVal.OwnerId = reqData.ownerid;
                }
                if (reqData.firstname) {
                    retVal.FirstName = reqData.firstname;
                } else {
                    retVal.FirstName = "";
                }
                if (reqData.middlename) {
                    retVal.MiddleName = reqData.middlename;
                } else {
                    retVal.MiddleName = "";
                }
                if (reqData.lastname) {
                    retVal.LastName = reqData.lastname;
                } else {
                    retVal.LastName = "";
                }
                if (reqData.mobileno) {
                    retVal.MobileNo = reqData.mobileno;
                } else {
                    retVal.MobileNo = null;
                }
                if (reqData.druglicense) {
                    retVal.DrugLicense = reqData.druglicense;
                } else {
                    retVal.DrugLicense = "";
                }
                if (reqData.shopname) {
                    retVal.ShopName = reqData.shopname;
                } else {
                    retVal.ShopName = "";
                }
                if (reqData.shopnumber) {
                    retVal.ShopNumber = reqData.shopnumber;
                } else {
                    retVal.ShopNumber = "";
                }
                if (reqData.maxusercount) {
                    retVal.MaxUserCount = reqData.maxusercount;
                } else {
                    retVal.MaxUserCount = null;
                }
                if (reqData.licid) {
                    retVal.LicId = reqData.licid;
                } else {
                    retVal.LicId = "";
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

    async GetRegistrationInfoFromDBEntity(reqData) {
        let retVal: RegistrationDetail = null;
        try {
            if (reqData) {
                retVal = new RegistrationDetail();
                if (reqData.ownerid) {
                    retVal.OwnerId = reqData.ownerid;
                }
                if (reqData.firstname) {
                    retVal.FirstName = reqData.firstname;
                } else {
                    retVal.FirstName = "";
                }
                if (reqData.middlename) {
                    retVal.MiddleName = reqData.middlename;
                } else {
                    retVal.MiddleName = "";
                }
                if (reqData.lastname) {
                    retVal.LastName = reqData.lastname;
                } else {
                    retVal.LastName = "";
                }
                if (reqData.mobileno) {
                    retVal.MobileNo = reqData.mobileno;
                } else {
                    retVal.MobileNo = null;
                }
                if (reqData.druglicense) {
                    retVal.DrugLicense = reqData.druglicense;
                } else {
                    retVal.DrugLicense = "";
                }
                if (reqData.shopname) {
                    retVal.ShopName = reqData.shopname;
                } else {
                    retVal.ShopName = "";
                }
                if (reqData.shopnumber) {
                    retVal.ShopNumber = reqData.shopnumber;
                } else {
                    retVal.ShopNumber = "";
                }
                if (reqData.maxusercount) {
                    retVal.MaxUserCount = reqData.maxusercount;
                } else {
                    retVal.MaxUserCount = null;
                }
                if (reqData.licid) {
                    retVal.LicId = reqData.licid;
                } else {
                    retVal.LicId = "";
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
                //retVal.IsDBCreated = 'N';
                retVal.CollectionCreated = 'N';
                retVal.Licensed = 'N';
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
                retVal = new User(false);
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
                retVal.Licensed = 'N';
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
                retVal = new User(true);
                retVal.UserType = "OWNER";
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

    async GetSalePersons(users: any[], licensed?: string) {
        let retVal: User[] = [];
        try {
            if (users && users.length > 0) {
                let userInfo: User;
                licensed = licensed && licensed.length > 0 ? licensed : 'N';
                for (let index = 0; index < users.length; index++) {
                    if (users[index]) {
                        //Validate user data
                        userInfo = await this.GetUserDoc(users[index]);
                        userInfo.Licensed = licensed;
                        retVal.push(userInfo);
                    }
                }
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async ValidateRequest(req) {
        let isValid: boolean = true;
        try {
            if (req) {
                if (!(req.registrationtype && (req.registrationtype == 'OWNER' || req.registrationtype == 'USER'))) {
                    isValid = false;
                }
                if (req.registrationtype && req.registrationtype.trim().length > 0) {
                    switch (req.registrationtype.trim().toUpperCase()) {
                        case 'OWNER':
                            if (isValid && !(req.ownerid && req.password && req.emailid && req.firstname && req.mobileno && req.druglicense && req.shopname && req.address && req.country)) {
                                isValid = false;
                            }
                            break;
                        case 'USER':
                            if (isValid && !req.ownerid) {
                                isValid = false;
                            }
                            break;
                    }
                }
                if (isValid && req.users && req.users.length > 0) {

                    for (let i = 0; i < req.users.length; i++) {
                        let ele = req.users[i];
                        if (ele) {
                            if (isValid && !(ele.firstname && ele.userid && ele.password && ele.address && ele.mobileno && ele.emailid)) {
                                isValid = false;
                            }
                        } else {
                            isValid = false;
                        }
                    }

                    // req.users.foreach(ele => {
                    //     if (ele) {
                    //         if (isValid && !(ele.firstname && ele.userid && ele.password && ele.address && ele.mobileno && ele.emailid)) {
                    //             isValid = false;
                    //             console.log(2);
                    //         }
                    //     } else {
                    //         isValid = false;
                    //     }
                    // });
                }
            } else {
                isValid = false;
            }
        } catch (e) {
            console.log(e);
            isValid = false;
        }
        return isValid;
    }

    async ValidateActivateUserRequest(req) {
        let isValid: boolean = true;
        try {
            if (req) {
                if (!req.ownerid) {
                    isValid = false;
                }
                if (!req.userid) {
                    if (req.users && req.users.length > 0) {
                        req.users.forEach(user => {
                            if (user) {
                                if (isValid && !(user.firstname && user.userid && user.password && user.address && user.mobileno && user.emailid)) {
                                    isValid = false;
                                }
                            } else {
                                isValid = false;
                            }
                        });
                    } else {
                        isValid = false;
                    }
                }
            } else {
                isValid = false;
            }
        } catch (e) {
            throw e;
        }
        return isValid;
    }
}

export let RegisterUtilHandle = new RegisterUtilHandler();