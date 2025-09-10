import RegionalAdmin from "../model/Regionaladmin";

export const createRegionalAdmin = async (
  firstname: string,
  lastname: string,
  email: string,
  phone_no: string,
  password: string,
  region: string,
  middlename?: string,
  profile_pic?: string
) => {
  try {
    const newRegionalAdmin = await RegionalAdmin.create({
      firstname,
      lastname,
      middlename,
      email,
      phone_no,
      password,
      profile_pic,
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
