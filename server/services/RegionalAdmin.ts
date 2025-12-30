import RegionalAdmin from "../model/Regionaladmin";
import SubRegion from "../model/SubRegion";
import Region from "../model/Region";
import subRegionalAdmin from "../model/SubRegionalAdmin";
import SubRegionalAdmin from "../model/SubRegionalAdmin";
import { ISuperAdmin, ISubRegion } from "../../types";
import Admin from "../model/Admin"

export const getRegionalAdminById = async (id: string) => {
    try {
        const foundAdmin = await Admin.findById(id, { password: 0 });
        return foundAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const getRegionalAdminByEmail = async (email: string , region?:string) => {
    try {
        const foundAdmin = await Admin.findOne({ email, region });
        return foundAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const createSubRegion = async (
    subRegionName: string,
    shortCode: string,
    region: string,
) => {
    try {
        const newSubRegion = await SubRegion.create({
            subRegionName,
            shortCode,
            region,
        });
        return newSubRegion;
    } catch (err: any) {
        throw err;
    }
};

export const getSubRegionById = async (id: string) => {
    try {
        const foundSubRegion = await SubRegion.findById(id);
        return foundSubRegion;
    } catch (err: any) {
        throw err;
    }
};

export const getSubRegionByName = async (name: string) => {
    try {
        const foundSubRegion = await SubRegion.findOne({ subRegionName: name });
        return foundSubRegion;
    } catch (err: any) {
        throw err;
    }
};
export const getAllSubRegion = async () => {
    try {
        const allSubRegion = await SubRegion.find();
        return allSubRegion;
    } catch (err: any) {
        throw err;
    }
};

export const createSubRegionalAdmin = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
    subRegion: string,
) => {
    try {
        const foundRegion = await SubRegion.findById(subRegion) ;
                let region = foundRegion.region
        const newSubRegionalAdmin = await Admin.create({
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            subRegion,
            region,
            role:"SUBREGIONAL ADMIN"
        });
        return newSubRegionalAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const getSubRegionalAdminById = async (id: string) => {
    try {
        const foundSubRegionAdmin = await Admin.findById(id, {
            password: 0,
        });
        return foundSubRegionAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const getSubRegionalAdminByEmail = async (email: string, region?:string) => {
    try {
        const foundSubRegionAdmin = await Admin.findOne({ email , region });
        return foundSubRegionAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const assignSubRegionAdmin = async (
    subRegionalAdmin: ISuperAdmin,
    subRegion: string,
) => {
    try {
        const foundSubRegion = await SubRegion.findById(subRegion);
        if (!foundSubRegion) {
            throw "no subRegion found with this ID !";
        }
        foundSubRegion.admin.push(subRegionalAdmin._id);
        await foundSubRegion.save();
        return foundSubRegion;
    } catch (err: any) {
        throw err;
    }
};

export const assignSubRegionToRegion = async (
    region: string,
    subRegion: ISubRegion,
) => {
    try {
        const foundRegion = await Region.findById(region);
        if (!foundRegion) {
            throw "no Region found with this ID !";
        }
        foundRegion.subRegion.push(subRegion._id);
        await foundRegion.save();
        return foundRegion;
    } catch (err: any) {
        throw err;
    }
};
