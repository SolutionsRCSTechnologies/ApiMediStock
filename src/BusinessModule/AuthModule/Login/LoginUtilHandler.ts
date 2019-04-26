import { ActiveSession } from '../../../CommonModule/DBEntities';

class LoginUtilHandler {

    async GetActiveSession(obj): Promise<ActiveSession> {
        let item: ActiveSession = null;
        try {
            if (obj) {
                item = new ActiveSession();
                if (obj.userid) {
                    item.UserId = obj.userid;
                } else {
                    item.UserId = '';
                }
                if (obj.sessionid) {
                    item.SessionId = obj.sessionid;
                } else {
                    item.SessionId = '';
                }
                if (obj.userdb) {
                    item.UserDB = obj.userdb;
                } else {
                    item.UserDB = '';
                }
                if (obj.starttime) {
                    item.StartTime = obj.starttime;
                } else {
                    item.StartTime = new Date();
                }
                if (obj.endtime) {
                    item.EndTime = obj.endtime;
                } else {
                    item.EndTime = new Date();
                }
                if (obj.createdat) {
                    item.CreatedAt = obj.createdat;
                } else {
                    item.CreatedAt = new Date();
                }
                if (obj.updatedat) {
                    item.UpdatedAt = obj.updatedat;
                } else {
                    item.UpdatedAt = new Date();
                }
                if (obj.createdby) {
                    item.CreatedBy = obj.createdby;
                } else {
                    item.CreatedBy = 'SYSTEM';
                }
                if (obj.updatedby) {
                    item.UpdatedBy = obj.updatedby;
                } else {
                    item.UpdatedBy = 'SYSTEM';
                }
                if (obj.usertype) {
                    item.UserType = obj.usertype;
                } else {
                    item.UserType = '';
                }
            }
        }
        catch (e) {
            throw e;
        }
        return item;
    }

    async ValidateHeaderRequest(header: any) {
        let isValid = true;
        if (header) {
            if (!(header.userid && header.userid.length > 0)) {
                isValid = false;
            }
            if (!(header.sessionid && header.sessionid.length > 0)) {
                isValid = false;
            }
        } else {
            isValid = false;
        }
        return isValid;
    }

    async ValidateLoginRequest(reqData: any) {
        let isValid = true;
        if (reqData) {
            if (!(reqData.userid && reqData.userid.length > 0)) {
                isValid = false;
            }
            if (!(reqData.sessionid && reqData.sessionid.length > 0) && !(reqData.password && reqData.password.length > 0)) {
                isValid = false;
            }
        } else {
            isValid = false;
        }
        return isValid;
    }

    async ValidateLogoutRequest(reqData: any) {
        let isValid = true;
        if (reqData) {
            if (!(reqData.userid && reqData.userid.length > 0)) {
                isValid = false;
            }
            if (!(reqData.sessionid && reqData.sessionid.length > 0)) {
                isValid = false;
            }
        } else {
            isValid = false;
        }
        return isValid;
    }

    async ValidateUpdateUserRoleRequest(reqData: any) {
        let isValid: boolean = true;
        try {
            if (reqData) {
                if (!(reqData.userid && reqData.userid.length > 0)) {
                    isValid = false;
                }
                if (reqData.role && reqData.role.length > 0) {
                    switch (reqData.role.toUpperCase()) {
                        case 'USER':
                        case 'ADMIN':
                            break;
                        default:
                            isValid = false;
                            break;
                    }
                } else {
                    isValid = false;
                }
            } else {
                isValid = false;
            }
        } catch (e) {
            isValid = false;
        }
        return isValid;
    }
}

export let LoginUtilHandle = new LoginUtilHandler();