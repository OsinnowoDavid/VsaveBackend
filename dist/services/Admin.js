"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegionByName = exports.getAllRegion = exports.getRegionalAdminByFullName = exports.getRegionalAdminByEmail = exports.getRegionalAdminById = exports.createRegionalAdmin = exports.createNewRegion = exports.getAllSuperAdminByEmail = exports.getAllSuperAdminById = exports.CreateSuperAdmin = void 0;
const Super_admin_1 = __importDefault(require("../model/Super_admin"));
const Regionaladmin_1 = __importDefault(require("../model/Regionaladmin"));
const Region_1 = __importDefault(require("../model/Region"));
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
const createNewRegion = async (regionName, shortCode) => {
    try {
        const newRegion = await Region_1.default.create({
            regionName,
            shortCode,
        });
        return newRegion;
    }
    catch (err) {
        throw err;
    }
};
exports.createNewRegion = createNewRegion;
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
const getRegionalAdminByFullName = async (fullName) => {
    try {
        const foundAdmin = await Regionaladmin_1.default.findOne({ fullName });
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getRegionalAdminByFullName = getRegionalAdminByFullName;
const getAllRegion = async () => {
    try {
        const allRegion = await Region_1.default.find();
        let result = [];
        allRegion.forEach((region) => {
            let finalResult = {
                region: region.regionName,
                shortCode: region.shortCode,
            };
            result.push(finalResult);
        });
        return result;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllRegion = getAllRegion;
const getRegionByName = async (regionName) => {
    try {
        const foundRegion = await Region_1.default.findOne({ regionName });
        return foundRegion;
    }
    catch (err) {
        throw err;
    }
};
exports.getRegionByName = getRegionByName;
