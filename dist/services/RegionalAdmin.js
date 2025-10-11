"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignSubRegionToRegion = exports.getAllSubRegion = exports.assignSubRegionAdmin = exports.getSubRegionalAdminByEmail = exports.getSubRegionalAdminById = exports.createSubRegionalAdmin = exports.getSubRegionByName = exports.getSubRegionById = exports.createSubRegion = exports.getRegionalAdminByEmail = exports.getRegionalAdminById = void 0;
const Regionaladmin_1 = __importDefault(require("../model/Regionaladmin"));
const SubRegion_1 = __importDefault(require("../model/SubRegion"));
const Region_1 = __importDefault(require("../model/Region"));
const SubRegionalAdmin_1 = __importDefault(require("../model/SubRegionalAdmin"));
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
const createSubRegionalAdmin = async (firstName, lastName, email, password, phoneNumber, subRegion) => {
    try {
        const newSubRegionalAdmin = await SubRegionalAdmin_1.default.create({
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            subRegion,
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
        const foundSubRegionAdmin = await SubRegionalAdmin_1.default.findById(id);
        return foundSubRegionAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getSubRegionalAdminById = getSubRegionalAdminById;
const getSubRegionalAdminByEmail = async (email) => {
    try {
        const foundSubRegionAdmin = await SubRegionalAdmin_1.default.findOne({ email });
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
