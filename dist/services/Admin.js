"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = exports.getAdminSavingsConfig = exports.setAdminSavingsConfig = exports.getRegionByName = exports.getAllRegion = exports.getRegionalAdminByEmail = exports.getRegionalAdminById = exports.getAllRegionalAdmin = exports.assignRegionalAdmin = exports.createRegionalAdmin = exports.createNewRegion = exports.getAllSuperAdminByEmail = exports.getSuperAdminById = exports.CreateSuperAdmin = void 0;
const Super_admin_1 = __importDefault(require("../model/Super_admin"));
const Regionaladmin_1 = __importDefault(require("../model/Regionaladmin"));
const Region_1 = __importDefault(require("../model/Region"));
const Admin_config_1 = __importDefault(require("../model/Admin_config"));
const CreateSuperAdmin = async (firstName, lastName, email, phoneNumber, password, profilePicture) => {
    try {
        const newSuperAdmin = await Super_admin_1.default.create({
            firstName,
            lastName,
            email,
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
const getSuperAdminById = async (id) => {
    try {
        const foundAdmin = await Super_admin_1.default.findById(id, { password: 0 });
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getSuperAdminById = getSuperAdminById;
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
const createRegionalAdmin = async (firstName, lastName, email, phoneNumber, password, region, profilePicture) => {
    try {
        const newRegionalAdmin = await Regionaladmin_1.default.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            region,
            profilePicture,
        });
        return newRegionalAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.createRegionalAdmin = createRegionalAdmin;
const assignRegionalAdmin = async (admin, region) => {
    try {
        const foundRegion = await Region_1.default.findById(region);
        if (!foundRegion) {
            throw "region not found !";
        }
        foundRegion.admin.push(admin._id);
        await foundRegion.save();
        return foundRegion;
    }
    catch (err) {
        throw err;
    }
};
exports.assignRegionalAdmin = assignRegionalAdmin;
const getAllRegionalAdmin = async () => {
    try {
        const allRegionalAdmin = await Regionaladmin_1.default.find();
        return allRegionalAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllRegionalAdmin = getAllRegionalAdmin;
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
const setAdminSavingsConfig = async (defaultPenaltyFee, firstTimeAdminFee, loanPenaltyFee, fixedSavingsAnualInterest, fixedSavingsPenaltyFee) => {
    try {
        const configSettings = await Admin_config_1.default.getSettings();
        configSettings.defaultPenaltyFee = defaultPenaltyFee;
        configSettings.firstTimeAdminFee = firstTimeAdminFee;
        configSettings.loanPenaltyFee = loanPenaltyFee;
        configSettings.fixedSavingsAnualInterest = fixedSavingsAnualInterest;
        configSettings.fixedSavingsPenaltyFee = fixedSavingsPenaltyFee;
        await configSettings.save();
        return configSettings;
    }
    catch (err) {
        throw err;
    }
};
exports.setAdminSavingsConfig = setAdminSavingsConfig;
const getAdminSavingsConfig = async () => {
    try {
        const configSettngs = await Admin_config_1.default.getSettings();
        return configSettngs;
    }
    catch (err) {
        throw err;
    }
};
exports.getAdminSavingsConfig = getAdminSavingsConfig;
const sendNotification = async (to, recipientId, title, message) => {
    try {
    }
    catch (err) {
        throw err;
    }
};
exports.sendNotification = sendNotification;
