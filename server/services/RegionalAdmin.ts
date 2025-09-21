import RegionalAdmin from "../model/Regionaladmin";

export const createRegionalAdmin = async (
  fullName: string,
  email: string,
  phoneNumber: string,
  password: string,
  region: string,
  profilePicture?: string
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
