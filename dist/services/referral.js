"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignReferralCodeToExistingUser = exports.getSingleReferralRecord = exports.assignReferral = exports.createReferralCodeForUser = exports.getUserReferralByReferredUser = exports.getAllUserReferralRecord = exports.editUserReferralRecord = exports.getUserReferralByStatus = exports.createUserReferral = void 0;
const User_referral_1 = __importDefault(require("../model/User_referral"));
const User_1 = __importDefault(require("../model/User"));
const tools_1 = require("../config/tools");
const createUserReferral = async (user, referredUser) => {
    try {
        const foundUserRecord = await User_1.default.findById(user);
        const newRecord = await User_referral_1.default.create({
            user,
            referredUser,
            referralCode: foundUserRecord.referralCode,
            bonusAmount: 500,
            status: "pending",
            referredUserTask: {
                fundVSaveWallet: false,
                createSavingsPlan: false,
                complete5SuccessfulSavingsCircle: false,
            }
        });
        return newRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.createUserReferral = createUserReferral;
const getUserReferralByStatus = async (user, status) => {
    try {
        const foundRecord = await User_referral_1.default.find({ user, status });
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserReferralByStatus = getUserReferralByStatus;
const editUserReferralRecord = async (referredUser, referredUserTask, status) => {
    try {
        const foundRecord = await User_referral_1.default.findOne({
            referredUser
        });
        foundRecord.status = status;
        foundRecord.referredUserTask = referredUserTask;
        if (status === "completed") {
            foundRecord.depositedToAvaliableBalnace = true;
            foundRecord.depositedToAvaliableBalnaceDate = new Date();
        }
        await foundRecord.save();
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.editUserReferralRecord = editUserReferralRecord;
const getAllUserReferralRecord = async (user) => {
    try {
        const foundRecord = await User_referral_1.default.find({ user });
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllUserReferralRecord = getAllUserReferralRecord;
const getUserReferralByReferredUser = async (referredUser) => {
    try {
        const foundRecord = await User_referral_1.default.findOne({
            referredUser
        });
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserReferralByReferredUser = getUserReferralByReferredUser;
const createReferralCodeForUser = async (user) => {
    try {
        const foundUserRecord = await User_1.default.findById(user);
        let referralCode = '';
        let existingRecord = null;
        do {
            referralCode = (0, tools_1.generateReferralRefrenceCode)("USER");
            existingRecord = await User_1.default.findOne({ referralCode });
        } while (existingRecord);
        foundUserRecord.referralCode = referralCode;
        await foundUserRecord.save();
        return foundUserRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.createReferralCodeForUser = createReferralCodeForUser;
const assignReferral = async (user, referralCode) => {
    try {
        let foundUser = {};
        let firstLetter = referralCode.charAt(0);
        // check if its a User referral code 
        if (firstLetter === "U") {
            foundUser = await User_1.default.findOne({ referralCode });
            if (!foundUser) {
                return { err: true, message: "account created but, no user found with this referral code" };
            }
            let newRecord = await (0, exports.createUserReferral)(foundUser._id.toString(), user);
            foundUser.pendingBalance += 500;
            await foundUser.save();
            return "Successful";
        }
        ;
        return { err: true, message: "account created but, invalid referral code" };
    }
    catch (err) {
        throw err;
    }
};
exports.assignReferral = assignReferral;
const getSingleReferralRecord = async (id) => {
    try {
        const foundRecord = await User_referral_1.default.findById(id);
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getSingleReferralRecord = getSingleReferralRecord;
const assignReferralCodeToExistingUser = async () => {
    try {
        const allUser = await User_1.default.find();
        for (const user of allUser) {
            user.referralCode = (0, tools_1.generateReferralRefrenceCode)("USER");
            await user.save();
        }
        return "done";
    }
    catch (err) {
        throw err;
    }
};
exports.assignReferralCodeToExistingUser = assignReferralCodeToExistingUser;
