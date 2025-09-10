import Admin from "../model/Superadmin";

export const CreateSuperAdmin = async (
  firstname: string,
  lastname: string,
  email: string,
  phone_no: string,
  password: string,
  middlename?: string,
  profile_pic?: string
) => {
  try {
    let type = "superadmin";
    const newSuperAdmin = await Admin.create({
      firstname,
      lastname,
      middlename,
      email,
      type,
      phone_no,
      password,
      profile_pic,
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
export const getAllSuperadminById = async (id: string) => {
  try {
    const foundAdmin = await Admin.findById(id);
    return foundAdmin;
  } catch (err: any) {
    throw err;
  }
};

export const getAllSuperadminByEmail = async (email: string) => {
  try {
    const foundAdmin = await Admin.findOne({ email });
    return foundAdmin;
  } catch (err: any) {
    throw err;
  }
};
