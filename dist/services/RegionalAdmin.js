"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegionalAdminByEmail = exports.getRegionalAdminById = exports.createRegionalAdmin = void 0;
const Regionaladmin_1 = __importDefault(require("../model/Regionaladmin"));
const createRegionalAdmin = async (fullName, email, phoneNumber, password, region, profilePicture) => {
    try {
        const newRegionalAdmin = await Regionaladmin_1.default.create({
            fullName,
            email,
            phoneNumber,
            password,
            profilePicture,
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
