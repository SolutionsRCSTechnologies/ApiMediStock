import { LicenseOpHandle } from './LicenseOperation';

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
        // 
    }
}

export let LicenseHandle = new LicenseHandler();