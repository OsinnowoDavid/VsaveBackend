import RegionalAdmin from "../model/Regionaladmin";
import SubRegion from "../model/SubRegion";
import Region from "../model/Region";
import subRegionalAdmin from "../model/SubRegionalAdmin";
import SubRegionalAdmin from "../model/SubRegionalAdmin";
import { ISuperAdmin, ISubRegion } from "../../types";

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
        const newSubRegionalAdmin = await SubRegionalAdmin.create({
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            subRegion,
        });
        return newSubRegionalAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const getSubRegionalAdminById = async (id: string) => {
    try {
        const foundSubRegionAdmin = await SubRegionalAdmin.findById(id);
        return foundSubRegionAdmin;
    } catch (err: any) {
        throw err;
    }
};

export const getSubRegionalAdminByEmail = async (email: string) => {
    try {
        const foundSubRegionAdmin = await SubRegionalAdmin.findOne({ email });
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
