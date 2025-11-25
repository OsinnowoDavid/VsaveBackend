"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllActiveFixedSavings = exports.getUserFixedSavings = exports.getUserCompletedFixedSavings = exports.getUserActiveFixedSavings = exports.disburseSavings = exports.havePendingLoanAndSaVingsStatus = exports.latePaymentDeduction = exports.getAllContributionStatus = exports.userSavingsRecords = exports.getSavingsContributionById = exports.allUserActiveSavingsRecord = exports.savingsDeductionSchedule = exports.checkForCircleById = exports.updateSavingsAutoRenewStatus = exports.restartSavingsCircle = exports.getAllUserActiveSavingsRecord = exports.getAllUserPausedSavingsRecord = exports.getUserPausedSavingsRecord = exports.getUserActiveSavingsRecord = exports.getAllUserSavingsCircle = exports.joinSavings = exports.getUserSavingsRecordById = exports.getUserSavingsCircleById = exports.createUserPersonalSavings = exports.getAllSavingsCircle = exports.getAllActiveSavingsCircle = exports.getCircleById = exports.initSavingsPlan = void 0;
const Admin_config_1 = __importDefault(require("../model/Admin_config"));
const Savings_circle_1 = __importDefault(require("../model/Savings_circle"));
const User_savings_record_1 = __importDefault(require("../model/User_savings_record"));
const User_savings_circle_1 = __importDefault(require("../model/User_savings_circle"));
const SavingsContribution_1 = __importDefault(require("../model/SavingsContribution"));
const FixedSavings_1 = __importDefault(require("../model/FixedSavings"));
const Loan_1 = __importDefault(require("../model/Loan"));
const tools_1 = require("../config/tools");
const User_1 = require("./User");
const generateCircleId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    return code;
};
const initSavingsPlan = async (user, subRegion, savingsTitle, frequency, savingsAmount, status, deductionPeriod, duration, maturityAmount) => {
    try {
        const newSavingsCircle = await Savings_circle_1.default.create({
            subRegion,
            savingsTitle,
            frequency,
            duration,
            deductionPeriod,
            savingsAmount,
            circleId: generateCircleId(),
            status,
            maturityAmount,
            adminId: user,
        });
        return newSavingsCircle;
    }
    catch (err) {
        throw err;
    }
};
exports.initSavingsPlan = initSavingsPlan;
const getCircleById = async (id) => {
    try {
        const foundCircle = await Savings_circle_1.default.findById(id);
        return foundCircle;
    }
    catch (err) {
        throw err;
    }
};
exports.getCircleById = getCircleById;
const getAllActiveSavingsCircle = async (subRegion) => {
    try {
        const allActiveCircle = await Savings_circle_1.default.find({
            status: "ACTIVE",
            subRegion,
        });
        return allActiveCircle;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllActiveSavingsCircle = getAllActiveSavingsCircle;
const getAllSavingsCircle = async () => {
    try {
        const allSavingsCircle = await Savings_circle_1.default.find();
        return allSavingsCircle;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllSavingsCircle = getAllSavingsCircle;
const createUserPersonalSavings = async (user, savingsTitle, frequency, duration, deductionPeriod, savingsAmount, maturityAmount, startDate, endDate, autoRestartEnabled) => {
    try {
        const newSavingsCircle = await User_savings_circle_1.default.create({
            user,
            savingsTitle,
            frequency,
            duration,
            deductionPeriod,
            savingsAmount,
            circleId: generateCircleId(),
            maturityAmount,
        });
        const newSavingsRecord = (await User_savings_record_1.default.create({
            user,
            savingsCircleId: newSavingsCircle._id,
            duration,
            startDate,
            endDate,
            maturityAmount,
            status: "PAUSED",
            autoRestartEnabled,
        }));
        const newSavingsContribution = await SavingsContribution_1.default.create({
            user,
            savingsRecordId: newSavingsRecord._id,
        });
        newSavingsRecord.contributionId = newSavingsContribution._id;
        await newSavingsRecord.save();
        return {
            newSavingsCircle,
            newSavingsRecord,
            newSavingsContribution,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.createUserPersonalSavings = createUserPersonalSavings;
const getUserSavingsCircleById = async (circleId) => {
    try {
        const foundUserSavingsCircle = await User_savings_circle_1.default.findById(circleId);
        return foundUserSavingsCircle;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserSavingsCircleById = getUserSavingsCircleById;
const getUserSavingsRecordById = async (id) => {
    try {
        const foundRecord = await User_savings_record_1.default.findById(id);
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserSavingsRecordById = getUserSavingsRecordById;
const joinSavings = async (user, circleId, autoRestartEnabled, startDate, endDate, status) => {
    try {
        const foundSavingsCircle = await Savings_circle_1.default.findById(circleId);
        const newSavingsRecord = (await User_savings_record_1.default.create({
            user: user._id,
            savingsCircleId: foundSavingsCircle._id,
            duration: foundSavingsCircle.duration,
            startDate,
            endDate,
            maturityAmount: foundSavingsCircle.maturityAmount,
            status,
            autoRestartEnabled,
        }));
        const newSavingsContribution = await SavingsContribution_1.default.create({
            user: user._id,
            savingsRecordId: newSavingsRecord._id,
        });
        newSavingsRecord.contributionId = newSavingsContribution._id;
        await newSavingsRecord.save();
        return {
            newSavingsRecord,
            newSavingsContribution,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.joinSavings = joinSavings;
const getAllUserSavingsCircle = async (user) => {
    try {
        const foundSavingsCircle = await User_savings_circle_1.default.find({
            user: user._id,
        });
        return foundSavingsCircle;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllUserSavingsCircle = getAllUserSavingsCircle;
const getUserActiveSavingsRecord = async (user) => {
    try {
        const foundUserSavingsRecord = await User_savings_record_1.default.find({
            user: user._id,
            status: "ACTIVE",
        });
        return foundUserSavingsRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserActiveSavingsRecord = getUserActiveSavingsRecord;
const getUserPausedSavingsRecord = async (user) => {
    try {
        const foundUserSavingsRecord = User_savings_record_1.default.find({
            user: user._id,
            status: "PAUSED",
        });
        return foundUserSavingsRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserPausedSavingsRecord = getUserPausedSavingsRecord;
const getAllUserPausedSavingsRecord = async () => {
    try {
        const allPausedSavingsRecord = await User_savings_record_1.default.find({
            status: "PAUSED",
        });
        return allPausedSavingsRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllUserPausedSavingsRecord = getAllUserPausedSavingsRecord;
const getAllUserActiveSavingsRecord = async () => {
    try {
        const allActiveSavingsRecord = await User_savings_record_1.default.find({
            status: "ACTIVE",
        });
        return allActiveSavingsRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllUserActiveSavingsRecord = getAllUserActiveSavingsRecord;
const getTomorrowsDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
};
const restartSavingsCircle = async (user, circleId) => {
    try {
        const foundSavingsCircle = await Savings_circle_1.default.findById(circleId);
        let startDate = getTomorrowsDate();
        let endDate = (0, tools_1.calculateEndDate)(foundSavingsCircle.frequency, startDate, foundSavingsCircle.duration);
        const newSavingsRecord = (await User_savings_record_1.default.create({
            user: user,
            savingsCircleId: foundSavingsCircle._id,
            duration: foundSavingsCircle.duration,
            startDate,
            endDate,
            maturityAmount: foundSavingsCircle.maturityAmount,
            status: "PAUSED",
            autoRestartEnabled: true,
        }));
        const newSavingsContribution = await SavingsContribution_1.default.create({
            user: user,
            savingsRecordId: newSavingsRecord._id,
        });
        newSavingsRecord.contributionId = newSavingsContribution._id;
        await newSavingsRecord.save();
        return {
            newSavingsRecord,
            newSavingsContribution,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.restartSavingsCircle = restartSavingsCircle;
const updateSavingsAutoRenewStatus = async (user, savingsRecordId, autoRenewStatus) => {
    try {
        const foundRecord = (await User_savings_record_1.default.findOne({
            _id: savingsRecordId,
            user: user._id,
        }));
        foundRecord.autoRestartEnabled = autoRenewStatus;
        await foundRecord.save();
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.updateSavingsAutoRenewStatus = updateSavingsAutoRenewStatus;
const checkForCircleById = async (circleId) => {
    try {
        let result = {};
        const foundAdminCircle = await Savings_circle_1.default.findById(circleId);
        const foundUserCircle = await User_savings_circle_1.default.findById(circleId);
        if (foundAdminCircle) {
            result = foundAdminCircle;
        }
        if (foundUserCircle) {
            result = foundUserCircle;
        }
        return result;
    }
    catch (err) {
        throw err;
    }
};
exports.checkForCircleById = checkForCircleById;
const savingsDeductionSchedule = async (savingsRecordId, amount, withdrawStatus) => {
    try {
        // update user savings record first
        const foundSavingsRecord = await User_savings_record_1.default.findById(savingsRecordId);
        foundSavingsRecord.period = foundSavingsRecord.period + 1;
        await foundSavingsRecord.save();
        if (withdrawStatus) {
            const foundContribution = await SavingsContribution_1.default.findById(foundSavingsRecord.contributionId);
            console.log("period:", foundSavingsRecord.period);
            if (Number(foundSavingsRecord.period) === 1) {
                const { firstTimeAdminFee } = await Admin_config_1.default.getSettings();
                //deduct Admin fee
                let adminFeeAmount = (amount * Number(firstTimeAdminFee)) / 100;
                let record = {
                    periodIndex: foundSavingsRecord.period,
                    amount: amount - Number(adminFeeAmount),
                    status: "paid",
                };
                foundContribution.adminFirstTimeFee = adminFeeAmount;
                foundContribution.record.push(record);
                await foundSavingsRecord.save();
                await foundContribution.save();
                return {
                    foundSavingsRecord,
                    foundContribution,
                };
            }
            let record = {
                periodIndex: foundSavingsRecord.period,
                amount,
                status: "paid",
            };
            foundContribution.record.push(record);
            await foundContribution.save();
            return {
                foundSavingsRecord,
                foundContribution,
            };
        }
        const foundContribution = await SavingsContribution_1.default.findById(foundSavingsRecord.contributionId);
        let record = {
            periodIndex: foundSavingsRecord.period,
            amount,
            status: "pending",
        };
        foundContribution.record.push(record);
        await foundContribution.save();
        return {
            foundSavingsRecord,
            foundContribution,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.savingsDeductionSchedule = savingsDeductionSchedule;
const allUserActiveSavingsRecord = async (user) => {
    try {
        const allActiveRecord = await User_savings_record_1.default.find({
            user: user._id,
            status: "ACTIVE",
        });
        return allActiveRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.allUserActiveSavingsRecord = allUserActiveSavingsRecord;
const getSavingsContributionById = async (contributionId) => {
    try {
        const foundSavingsContribution = await SavingsContribution_1.default.findById(contributionId);
        return foundSavingsContribution;
    }
    catch (err) {
        throw err;
    }
};
exports.getSavingsContributionById = getSavingsContributionById;
const userSavingsRecords = async (user) => {
    try {
        const allSavingsRecords = await User_savings_record_1.default.find({
            user: user._id,
        });
        return allSavingsRecords;
    }
    catch (err) {
        throw err;
    }
};
exports.userSavingsRecords = userSavingsRecords;
const getAllContributionStatus = async (contributionId) => {
    try {
        const foundRecord = await SavingsContribution_1.default.findById(contributionId);
        let result = [];
        for (const record of foundRecord.record) {
            result.push(record.status);
        }
        return result;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllContributionStatus = getAllContributionStatus;
const latePaymentDeduction = async (user) => {
    try {
        const { defaultPenaltyFee, firstTimeAdminFee } = await Admin_config_1.default.getSettings();
        const foundSavingsContribution = await SavingsContribution_1.default.find({
            user: user._id,
        });
        for (const contributionRecord of foundSavingsContribution) {
            // check record array for pending payment
            for (const record of contributionRecord.record) {
                if (record.status === "pending") {
                    // check if its the first index  so as to deduct admin first time fee
                    if (record.periodIndex === 1) {
                        let amount = record.amount + Number(defaultPenaltyFee);
                        let adminFeeAmount = (record.amount * Number(firstTimeAdminFee)) / 100;
                        let remark = `savings late repayment deduction record : ${contributionRecord._id}`;
                        const withdraw = await (0, User_1.userWithdraw)(contributionRecord.user.toString(), amount, remark);
                        if (withdraw === "Insufficient Funds") {
                            record.status = "pending";
                            return;
                        }
                        record.status = "paid";
                        return;
                    }
                    let amount = record.amount + Number(defaultPenaltyFee);
                    let remark = `savings late repayment deduction record : ${contributionRecord._id}`;
                    const withdraw = await (0, User_1.userWithdraw)(contributionRecord.user.toString(), amount, remark);
                    if (withdraw === "Insufficient Funds") {
                        record.status = "pending";
                        return;
                    }
                    record.status = "paid";
                    return;
                }
            }
            await contributionRecord.save();
            return;
        }
    }
    catch (err) {
        throw err;
    }
};
exports.latePaymentDeduction = latePaymentDeduction;
const havePendingLoanAndSaVingsStatus = async (user) => {
    try {
        const foundLoanRecord = await Loan_1.default.find({ user, isSettled: false });
        const foundSavingsRecord = await User_savings_record_1.default.find({
            user,
            status: "ACTIVE",
        });
        let result = {
            loanStatus: false,
            savingsStatus: false,
        };
        if (foundLoanRecord.length > 0) {
            result.loanStatus = true;
        }
        for (const savingsRecord of foundSavingsRecord) {
            const foundContribution = await SavingsContribution_1.default.findById(savingsRecord._id);
            const allStatus = await (0, exports.getAllContributionStatus)(foundContribution._id.toString());
            const isCompleted = (0, tools_1.checkIfContributionIsCompleted)(allStatus);
            if (!isCompleted) {
                result.savingsStatus = true;
            }
        }
        return result;
    }
    catch (err) {
        throw err;
    }
};
exports.havePendingLoanAndSaVingsStatus = havePendingLoanAndSaVingsStatus;
const disburseSavings = async (savingsRecordId) => {
    try {
        const foundRecord = await User_savings_record_1.default.findById(savingsRecordId);
        const foundContribution = await SavingsContribution_1.default.findById(foundRecord.contributionId);
        let ref = (0, tools_1.generateSavingsRefrenceCode)();
        let remark = `savings disbursement , savings circle is completed, and ${foundRecord.maturityAmount} is been deposited`;
        const deposit = await (0, User_1.userDeposit)(foundRecord.user.toString(), foundRecord.maturityAmount, ref, new Date(), "Vsave savings", remark);
        // update savings record and contribution
        foundRecord.payOutDate = new Date();
        foundRecord.payOutStatus = true;
        foundRecord.status = "ENDED";
        await foundRecord.save();
        return {
            userRecord: foundRecord,
            userContribution: foundContribution,
        };
    }
    catch (err) {
        throw err;
    }
};
exports.disburseSavings = disburseSavings;
const getUserActiveFixedSavings = async (user) => {
    try {
        const activeRecord = await FixedSavings_1.default.find({
            user: user._id,
            status: "active",
        });
        return activeRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserActiveFixedSavings = getUserActiveFixedSavings;
const getUserCompletedFixedSavings = async (user) => {
    try {
        const completedRecord = await FixedSavings_1.default.find({
            user: user._id,
            status: "completed",
        });
        return completedRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserCompletedFixedSavings = getUserCompletedFixedSavings;
const getUserFixedSavings = async (user) => {
    try {
        const allRecord = await FixedSavings_1.default.find({
            user: user._id,
        });
        return allRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserFixedSavings = getUserFixedSavings;
const getAllActiveFixedSavings = async () => {
    try {
        const foundRecord = await FixedSavings_1.default.find({
            status: "active",
        });
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllActiveFixedSavings = getAllActiveFixedSavings;
