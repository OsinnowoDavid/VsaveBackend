import Admin from "../model/Super_admin";

export const CreateSuperAdmin = async (
  fullName: string,
  email: string,
  phoneNumber: string,
  password: string,
  profilePicture?: string
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

// export const createRegionalAdmin = async (
//       firstname: string,
//   lastname: string,
//   email: string,
//   phone_no: string,
//   password: string,
//   profile_pic?: string,
//   middlename?: string
// ) =>{
//     try{
//         let type = "regionaladmin" ;
//         const newRegionalAdmin = await Admin.create({
//             firstname,
//       lastname,
//       middlename,
//       email,
//       type,
//       phone_no,
//       password,
//       profile_pic,
//         })
//         return newRegionalAdmin
//     }catch(err:any){
//         throw err
//     }
// }
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
