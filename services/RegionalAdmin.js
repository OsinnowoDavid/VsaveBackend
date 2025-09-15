"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegionalAdminByEmail = exports.getRegionalAdminById = exports.createRegionalAdmin = void 0;
const Regionaladmin_1 = __importDefault(require("../model/Regionaladmin"));
const createRegionalAdmin = async (firstname, lastname, email, phone_no, password, region, middlename, profile_pic) => {
    try {
        const newRegionalAdmin = await Regionaladmin_1.default.create({
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
    }
    catch (err) {
        throw err;
    }
};
exports.createRegionalAdmin = createRegionalAdmin;
const getRegionalAdminById = async (id) => {
    try {
        const foundAdmin = await Regionaladmin_1.default.findById(id);
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getRegionalAdminById = getRegionalAdminById;
const getRegionalAdminByEmail = async (email) => {
    try {
        const foundAdmin = await Regionaladmin_1.default.findOne({ email });
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getRegionalAdminByEmail = getRegionalAdminByEmail;
