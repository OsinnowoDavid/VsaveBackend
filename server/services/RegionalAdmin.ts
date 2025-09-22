import RegionalAdmin from "../model/Regionaladmin";

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
