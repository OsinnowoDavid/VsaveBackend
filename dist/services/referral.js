"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserReferralByStatus = exports.createUserReferral = void 0;
const User_referral_1 = __importDefault(require("../model/User_referral"));
const createUserReferral = async (user, referredUser) => {
    try {
        const newRecord = await User_referral_1.default.create({
            user,
            referredUser,
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
