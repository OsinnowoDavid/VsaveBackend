"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOfficerByEmail = exports.getOfficerById = exports.createOfficer = void 0;
const Officers_1 = __importDefault(require("../model/Officers"));
const createOfficer = async (firstName, lastName, email, phoneNumber, password, area, referralCode, level, profilePicture) => {
    try {
        const newOfficer = await Officers_1.default.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            referralCode,
            level,
            area,
            profilePicture
        });
        return newOfficer;
    }
    catch (err) {
        throw err;
    }
};
exports.createOfficer = createOfficer;
const getOfficerById = async (id, addPassword) => {
    try {
        if (addPassword) {
            const foundOfficer = await Officers_1.default.findById(id);
            return foundOfficer;
        }
        const foundOfficer = await Officers_1.default.findById(id, { password: 0 });
        return foundOfficer;
    }
    catch (err) {
        throw err;
    }
};
exports.getOfficerById = getOfficerById;
const getOfficerByEmail = async (email, addPassword) => {
    try {
        if (addPassword) {
            const foundOfficer = await Officers_1.default.findOne({ email });
            return foundOfficer;
        }
        const foundOfficer = await Officers_1.default.findOne({ email }).select('-password');
        return foundOfficer;
    }
    catch (err) {
        throw err;
    }
};
exports.getOfficerByEmail = getOfficerByEmail;
