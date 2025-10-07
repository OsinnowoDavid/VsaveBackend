import RegionalAdmin from "../model/Regionaladmin";
import SubRegion from "../model/SubRegion";
import SubRegionalAdmin from "../model/SubRegionalAdmin";

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
  shortCode: string
) => {
  try {
    const newSubRegion = await SubRegion.create({
      subRegionName,
      shortCode,
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

export const createSubRegionalAdmin = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phoneNumber: string
) => {
  try {
    const newSubRegionalAdmin = await SubRegionalAdmin.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
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
