"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositToTerminalAccount = exports.createTerminalRecord = exports.generateAndAsignLottoryId = void 0;
const User_1 = __importDefault(require("../model/User"));
const tools_1 = require("../config/tools");
const TerminalTransaction_1 = __importDefault(require("../model/TerminalTransaction"));
const TerminalDetails_1 = __importDefault(require("../model/TerminalDetails"));
const generateAndAsignLottoryId = async (user) => {
    try {
        let lottoryId = "";
        let existingRecord = {};
        do {
            lottoryId = (0, tools_1.generateLottoryRefrenceCode)();
            existingRecord = await User_1.default.findOne({ lottoryId });
        } while (existingRecord);
        const foundRecord = await User_1.default.findById(user);
        foundRecord.lottoryId = lottoryId;
        await foundRecord.save();
        //create terminal details record 
        await TerminalDetails_1.default.create({
            userId: user,
            lottoryId,
        });
        return lottoryId;
    }
    catch (err) {
        throw err;
    }
};
exports.generateAndAsignLottoryId = generateAndAsignLottoryId;
const createTerminalRecord = async (user, amount, transactionReference, remark) => {
    try {
        const foundUser = await User_1.default.findById(user);
        const newTerminalRecord = await TerminalTransaction_1.default.create({
            userId: foundUser._id,
            type: "deposit",
            amount,
            status: "success",
            transactionReference,
            from: `${foundUser.firstName} ${foundUser.lastName}`,
            date: new Date(),
            lottoryId: foundUser.lottoryId,
        });
        return newTerminalRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.createTerminalRecord = createTerminalRecord;
const depositToTerminalAccount = async (user, amount) => {
    try {
        const foundRecord = await TerminalDetails_1.default.findOne({ userId: user });
        foundRecord.terminalBalance += amount;
        await foundRecord.save();
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.depositToTerminalAccount = depositToTerminalAccount;
