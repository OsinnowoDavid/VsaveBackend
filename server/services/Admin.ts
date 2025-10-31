import Admin from "../model/Super_admin";
import RegionalAdmin from "../model/Regionaladmin";
import Region from "../model/Region";
import { ISuperAdmin } from "../types";
import AdminConfig from "../model/Admin_config";
export const CreateSuperAdmin = async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
    profilePicture?: string,
) => {
    try {
        const newSuperAdmin = await Admin.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            profilePicture,
        });
        return newSuperAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const getSuperAdminById = async (id: string) => {
    try {
        const foundAdmin = await Admin.findById(id);
        return foundAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const getAllSuperAdminByEmail = async (email: string) => {
    try {
        const foundAdmin = await Admin.findOne({ email });
        return foundAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const createNewRegion = async (
    regionName: string,
    shortCode: string,
) => {
    try {
        const newRegion = await Region.create({
            regionName,
            shortCode,
        });
        return newRegion;
    } catch (err: any) {
        throw err;
    }
};

export const createRegionalAdmin = async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
    region: string,
    profilePicture?: string,
) => {
    try {
        const newRegionalAdmin = await RegionalAdmin.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            region,
            profilePicture,
        });
        return newRegionalAdmin;
    } catch (err: any) {
        throw err;
    }
};
export const assignRegionalAdmin = async (
    admin: ISuperAdmin,
    region: string,
) => {
    try {
        const foundRegion = await Region.findById(region);
        if (!foundRegion) {
            throw "region not found !";
        }
        foundRegion.admin.push(admin._id);
        await foundRegion.save();
        return foundRegion;
    } catch (err: any) {
        throw err;
    }
};
export const getAllRegionalAdmin = async () => {
    try {
        const allRegionalAdmin = await RegionalAdmin.find();
        return allRegionalAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const getRegionalAdminById = async (id: string) => {
    try {
        const foundAdmin = await RegionalAdmin.findById(id);
        return foundAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const getRegionalAdminByEmail = async (email: string) => {
    try {
        const foundAdmin = await RegionalAdmin.findOne({ email });
        return foundAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const getAllRegion = async () => {
    try {
        const allRegion = await Region.find();
        let result: any = [];
        allRegion.forEach((region) => {
            let finalResult = {
                region: region.regionName,
                shortCode: region.shortCode,
            };
            result.push(finalResult);
        });
        return result;
    } catch (err: any) {
        throw err;
    }
};

export const getRegionByName = async (regionName: string) => {
    try {
        const foundRegion = await Region.findOne({ regionName });
        return foundRegion;
    } catch (err: any) {
        throw err;
    }
};

export const setAdminSavingsConfig = async (
    defaultPenaltyFee: string,
    firstTimeAdminFee: string,
) => {
    try {
        const configSettings = await AdminConfig.getSettings();
        configSettings.defaultPenaltyFee = defaultPenaltyFee;
        configSettings.firstTimeAdminFee = firstTimeAdminFee;
        await configSettings.save();
        return configSettings;
    } catch (err: any) {
        throw err;
    }
};

export const getAdminSavingsConfig = async () => {
    try {
        const configSettngs = await AdminConfig.getSettings();
        return configSettngs;
    } catch (err: any) {
        throw err;
    }
};
