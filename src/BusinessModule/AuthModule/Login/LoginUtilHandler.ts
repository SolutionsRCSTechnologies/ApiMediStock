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
}

export let LoginUtilHandle = new LoginUtilHandler();