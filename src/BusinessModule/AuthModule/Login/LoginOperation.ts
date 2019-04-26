import { LoginDBHandle } from './LoginDBHandler';
import { MethodResponse, DBConfiguaration } from '../../../CommonModule/Entities';
import { LoginUtilHandle } from './LoginUtilHandler';
import { Util } from '../../../CommonModule/UtilHandler';

class LoginOperations {
    async LoginProcess(header: any, body?: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (header) {
                if (await LoginUtilHandle.ValidateLoginRequest(header)) {
                    if (header.password && header.password.length > 0) {
                        retVal = await LoginDBHandle.Login(header);
                    } else if (header.sessionid && header.sessionid.length > 0) {
                        retVal = await LoginDBHandle.ValidateHeader(header);
                    } else {
                        retVal.ErrorCode = 3;
                        retVal.Message = 'Login request must have an user id and a password or active sessionid';
                    }
                    if (retVal && retVal.ErrorCode == 0 && retVal.Result) {
                        let res = retVal.Result;
                        retVal.Result = {
                            userid: res.userid,
                            sessionid: res.sessionid,
                            userrole: res.userrole,
                            username: res.username,
                            usertype: res.usertype
                        };
                        retVal.SessionId = res.sessionid;
                        retVal.ElapsedTo = res.elapsedtime;
                        retVal.UserName = res.username;
                        retVal.UserRole = res.userrole;
                        retVal.UserType = res.usertype;
                    }
                } else {
                    retVal.ErrorCode = 2;
                    retVal.Message = "Login request is not valid.";
                }
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = "Login request is empty, cannot validated.";
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async ValidateHeader(header) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (header) {
                if (await LoginUtilHandle.ValidateHeaderRequest(header)) {
                    retVal = await LoginDBHandle.ValidateHeader(header);
                } else {
                    retVal.ErrorCode = 2;
                    retVal.Message = 'The header request is not valid.';
                }
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'The header is empty.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async Logout(header: any, body?: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (header) {
                if (await LoginUtilHandle.ValidateLogoutRequest(header)) {
                    let userId: string = header.userid;
                    let sessionId: string = header.sessionid;
                    retVal = await LoginDBHandle.Logout(userId, sessionId);
                } else {
                    retVal.ErrorCode = 2;
                    retVal.Message = "Login request is not valid.";
                }
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = "Login request is empty, cannot validated.";
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }

    async UpdateUserRole(header: any, body: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            if (await LoginUtilHandle.ValidateUpdateUserRoleRequest(body)) {
                let output: MethodResponse = await this.ValidateHeader(header);
                if (output && output.ErrorCode == 0 && output.Result) {
                    let config: DBConfiguaration = await Util.GetDBDeatil(output);
                } else {
                    retVal.ErrorCode = 2;
                    retVal.Message = 'Header of the request is not valid.';
                }
            } else {
                retVal.ErrorCode = 1;
                retVal.Message = 'The role change request is invalid.';
            }
        } catch (e) {
            throw e;
        }
        return retVal;
    }
}

export let LoginOpHandle = new LoginOperations();