import Admin from "../model/Super_admin";
import RegionalAdmin from "../model/Regionaladmin";
import Region from "../model/Region";

export const CreateSuperAdmin = async (
    fullName: string,
    email: string,
    phoneNumber: string,
    password: string,
    profilePicture?: string,
) => {
    try {
        let type = "superadmin";
        const newSuperAdmin = await Admin.create({
            fullName,
            email,
            type,
            phoneNumber,
            password,
            profilePicture,
        });
        return newSuperAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const getAllSuperAdminById = async (id: string) => {
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
    fullName: string,
    email: string,
    phoneNumber: string,
    password: string,
    region: string,
    profilePicture?: string,
) => {
    try {
        const newRegionalAdmin = await RegionalAdmin.create({
            fullName,
            email,
            phoneNumber,
            password,
            profilePicture,
            region,
        });
        return newRegionalAdmin;
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

export const getRegionalAdminByFullName = async (fullName: string) => {
    try {
        const foundAdmin = await RegionalAdmin.findOne({ fullName });
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
