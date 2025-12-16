"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignSubRegionToRegion = exports.assignSubRegionAdmin = exports.getSubRegionalAdminByEmail = exports.getSubRegionalAdminById = exports.createSubRegionalAdmin = exports.getAllSubRegion = exports.getSubRegionByName = exports.getSubRegionById = exports.createSubRegion = exports.getRegionalAdminByEmail = exports.getRegionalAdminById = void 0;
const SubRegion_1 = __importDefault(require("../model/SubRegion"));
const Region_1 = __importDefault(require("../model/Region"));
const Admin_1 = __importDefault(require("../model/Admin"));
const getRegionalAdminById = async (id) => {
    try {
        const foundAdmin = await Admin_1.default.findById(id, { password: 0 });
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getRegionalAdminById = getRegionalAdminById;
const getRegionalAdminByEmail = async (email, region) => {
    try {
        const foundAdmin = await Admin_1.default.findOne({ email, region });
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getRegionalAdminByEmail = getRegionalAdminByEmail;
const createSubRegion = async (subRegionName, shortCode, region) => {
    try {
        const newSubRegion = await SubRegion_1.default.create({
            subRegionName,
            shortCode,
            region,
        });
        return newSubRegion;
    }
    catch (err) {
        throw err;
    }
};
exports.createSubRegion = createSubRegion;
const getSubRegionById = async (id) => {
    try {
        const foundSubRegion = await SubRegion_1.default.findById(id);
        return foundSubRegion;
    }
    catch (err) {
        throw err;
    }
};
exports.getSubRegionById = getSubRegionById;
const getSubRegionByName = async (name) => {
    try {
        const foundSubRegion = await SubRegion_1.default.findOne({ subRegionName: name });
        return foundSubRegion;
    }
    catch (err) {
        throw err;
    }
};
exports.getSubRegionByName = getSubRegionByName;
const getAllSubRegion = async () => {
    try {
        const allSubRegion = await SubRegion_1.default.find();
        return allSubRegion;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllSubRegion = getAllSubRegion;
const createSubRegionalAdmin = async (firstName, lastName, email, password, phoneNumber, subRegion, region) => {
    try {
        const newSubRegionalAdmin = await Admin_1.default.create({
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            subRegion,
            region,
            role: "SUBREGIONAL ADMIN"
        });
        return newSubRegionalAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.createSubRegionalAdmin = createSubRegionalAdmin;
const getSubRegionalAdminById = async (id) => {
    try {
        const foundSubRegionAdmin = await Admin_1.default.findById(id, {
            password: 0,
        });
        return foundSubRegionAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getSubRegionalAdminById = getSubRegionalAdminById;
const getSubRegionalAdminByEmail = async (email, region) => {
    try {
        const foundSubRegionAdmin = await Admin_1.default.findOne({ email, region });
        return foundSubRegionAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getSubRegionalAdminByEmail = getSubRegionalAdminByEmail;
const assignSubRegionAdmin = async (subRegionalAdmin, subRegion) => {
    try {
        const foundSubRegion = await SubRegion_1.default.findById(subRegion);
        if (!foundSubRegion) {
            throw "no subRegion found with this ID !";
        }
        foundSubRegion.admin.push(subRegionalAdmin._id);
        await foundSubRegion.save();
        return foundSubRegion;
    }
    catch (err) {
        throw err;
    }
};
exports.assignSubRegionAdmin = assignSubRegionAdmin;
const assignSubRegionToRegion = async (region, subRegion) => {
    try {
        const foundRegion = await Region_1.default.findById(region);
        if (!foundRegion) {
            throw "no Region found with this ID !";
        }
        foundRegion.subRegion.push(subRegion._id);
        await foundRegion.save();
        return foundRegion;
    }
    catch (err) {
        throw err;
    }
};
exports.assignSubRegionToRegion = assignSubRegionToRegion;
