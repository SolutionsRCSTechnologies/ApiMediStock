import { LicenseOpHandle } from './LicenseOperation';
import { MethodResponse } from '../../../CommonModule/Entities';

class LicenseHandler {
    async ValidateLicense(licid: string) {
        let isValid: boolean = false;
        try {
            if (licid) {
                isValid = await LicenseOpHandle.ValidateLicense(licid);
                console.log('Handler isValid :' + isValid);
            }
        } catch (e) {
            throw e;
        }
        return isValid;
    }

    async RegisterLicense(header: any, body: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            retVal = await LicenseOpHandle.RegisterLicense(header, body);
        } catch (e) {
            throw e;
        }
        return retVal;
    }
}

export let LicenseHandle = new LicenseHandler();