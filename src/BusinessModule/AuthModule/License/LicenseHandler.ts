import { LicenseOpHandle } from './LicenseOperation';
import { MethodResponse } from '../../../CommonModule/Entities';

class LicenseHandler {
    async ValidateLicense(licid: string) {
        let isValid: boolean = false;
        try {
            if (licid) {
                isValid = await LicenseOpHandle.ValidateLicense(licid);
            }
        } catch (e) {
            throw e;
        }
        return isValid;
    }

    async RegisterLicense(req: any) {
        let retVal: MethodResponse = new MethodResponse();
        try {
            retVal = await LicenseOpHandle.RegisterLicense(req);
        } catch (e) {
            throw e;
        }
        return retVal;
    }
}

export let LicenseHandle = new LicenseHandler();