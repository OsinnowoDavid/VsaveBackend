"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKYC1Record = exports.kycStatusChange = exports.createKYCRecord = exports.getUserVerificationToken = exports.assignUserEmailVerificationToken = exports.getUserByEmail = exports.getUserById = exports.createNewUser = void 0;
const User_1 = __importDefault(require("../model/User"));
const VerificationToken_1 = __importDefault(require("../model/VerificationToken"));
const KYC1_1 = __importDefault(require("../model/KYC1"));
const KYC_1 = __importDefault(require("../model/KYC"));
const createNewUser = async (fullname, email, password) => {
    try {
        const newUser = await User_1.default.create({
            fullname,
            email,
            password,
        });
        return newUser;
    }
    catch (err) {
        throw err;
    }
};
exports.createNewUser = createNewUser;
const getUserById = async (id) => {
    try {
        const foundUser = await User_1.default.findById(id);
        return foundUser;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserById = getUserById;
const getUserByEmail = async (email) => {
    try {
        const foundUser = await User_1.default.findOne({ email });
        return foundUser;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserByEmail = getUserByEmail;
const assignUserEmailVerificationToken = async (email, token, expiresAt) => {
    try {
        const foundUser = await User_1.default.findOne({ email });
        if (!foundUser) {
            throw {
                status: 404,
                message: "User not found",
            };
        }
        const assingToken = await VerificationToken_1.default.create({
            user: foundUser,
            email,
            token,
            expiresAt,
        });
        return assingToken;
    }
    catch (err) {
        throw err;
    }
};
exports.assignUserEmailVerificationToken = assignUserEmailVerificationToken;
const getUserVerificationToken = async (email, token) => {
    try {
        const foundToken = await VerificationToken_1.default.findOne({ email, token });
        return foundToken;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserVerificationToken = getUserVerificationToken;
const createKYCRecord = async (user) => {
    try {
        const newKYC = await KYC_1.default.create({
            user,
            kycStage: 1,
            status: "pending",
        });
        return newKYC;
    }
    catch (err) {
        throw err;
    }
};
exports.createKYCRecord = createKYCRecord;
const kycStatusChange = async (user, status, stage) => {
    try {
        const updatedKYCRecord = await KYC_1.default.findOneAndUpdate({ user }, { status, kycStage: stage }, { new: true });
        return updatedKYCRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.kycStatusChange = kycStatusChange;
const createKYC1Record = async (user, profession, accountNumber, accountDetails, country, state, nin) => {
    try {
        const newKYC1 = await KYC1_1.default.create({
            user,
            profession,
            accountNumber,
            accountDetails,
            country,
            state,
            nin,
        });
        const foundUser = await User_1.default.findById(user._id);
        foundUser;
        return newKYC1;
    }
    catch (err) {
        throw err;
    }
};
exports.createKYC1Record = createKYC1Record;
