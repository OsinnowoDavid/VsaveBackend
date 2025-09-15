"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSuperadminByEmail = exports.getAllSuperadminById = exports.CreateSuperAdmin = void 0;
const Superadmin_1 = __importDefault(require("../model/Superadmin"));
const CreateSuperAdmin = async (firstname, lastname, email, phone_no, password, middlename, profile_pic) => {
    try {
        let type = "superadmin";
        const newSuperAdmin = await Superadmin_1.default.create({
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
const getAllSuperadminById = async (id) => {
    try {
        const foundAdmin = await Superadmin_1.default.findById(id);
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllSuperadminById = getAllSuperadminById;
const getAllSuperadminByEmail = async (email) => {
    try {
        const foundAdmin = await Superadmin_1.default.findOne({ email });
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllSuperadminByEmail = getAllSuperadminByEmail;
