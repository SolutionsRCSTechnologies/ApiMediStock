import { LicenseDBHandle } from './LicenseDBHandler';

class LicenseOpHandler {
    async ValidateLicense(licid: string) {
        let isValid: boolean = false;
        try {
            if (licid) {
                isValid = await LicenseDBHandle.ValidateLicense(licid);
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

export let LicenseOpHandle = new LicenseOpHandler();