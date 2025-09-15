"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSuperAdminByEmail = exports.getAllSuperAdminById = exports.CreateSuperAdmin = void 0;
const Super_admin_1 = __importDefault(require("../model/Super_admin"));
const CreateSuperAdmin = async (fullName, email, phoneNumber, password, profilePicture) => {
    try {
        let type = "superadmin";
        const newSuperAdmin = await Super_admin_1.default.create({
            fullName,
            email,
            type,
            phoneNumber,
            password,
            profilePicture,
        });
        return newSuperAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.CreateSuperAdmin = CreateSuperAdmin;
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
const getAllSuperAdminById = async (id) => {
    try {
        const foundAdmin = await Super_admin_1.default.findById(id);
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllSuperAdminById = getAllSuperAdminById;
const getAllSuperAdminByEmail = async (email) => {
    try {
        const foundAdmin = await Super_admin_1.default.findOne({ email });
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllSuperAdminByEmail = getAllSuperAdminByEmail;
