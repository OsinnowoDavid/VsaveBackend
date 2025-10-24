"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSavingsPlan = exports.createAgent = void 0;
const Agents_1 = __importDefault(require("../model/Agents"));
const Agents_referral_1 = __importDefault(require("../model/Agents_referral"));
//import Savings from "../model/Savings"
const checkReferralCode = async (code) => {
    try {
        const foundCode = (await Agents_1.default.findOne({
            referralCode: code,
        }));
        return foundCode.referralCode;
    }
    catch (err) {
        throw err;
    }
};
const generateReferralCode = async () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    let foundCode = "";
    do {
        for (let i = 0; i < 7; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            code += chars[randomIndex];
        }
        foundCode = await checkReferralCode(code);
    } while (foundCode);
    return code;
};
const createAgent = async (firstName, lastName, email, phoneNumber, subRegion, password, profilePicture) => {
    try {
        let code = await generateReferralCode();
        const newAgent = await Agents_1.default.create({
            firstName,
            lastName,
            email,
            subRegion,
            password,
            phoneNumber,
            profilePicture,
            referralCode: code,
        });
        // create new agentReferral record
        const newAgentReferral = Agents_referral_1.default.create({
            agent: newAgent._id,
            referralCode: newAgent.referralCode,
        });
        return newAgent;
    }
    catch (err) {
        throw err;
    }
};
exports.createAgent = createAgent;
const initSavingsPlan = async (user, frequency, savingAmount, startDate, endDate, autoRestartEnabled) => {
    try {
    }
    catch (err) {
        throw err;
    }
};
exports.initSavingsPlan = initSavingsPlan;
