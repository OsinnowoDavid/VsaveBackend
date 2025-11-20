"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixedSavingsDisbursement = exports.savingsDisbursement = exports.deductSavingsFromUser = exports.endExpiredSavings = exports.startPauseSavings = void 0;
const Savings_1 = require("../services/Savings");
const User_1 = require("../services/User");
const tools_1 = require("../config/tools");
const startPauseSavings = async () => {
    try {
        // check for paused record that needs to start
        const allPausedSavings = await (0, Savings_1.getAllUserPausedSavingsRecord)();
        let todaysDate = new Date();
        for (const record of allPausedSavings) {
            let startDate = new Date(record.startDate);
            if (startDate === todaysDate) {
                record.status = "ACTIVE";
                await record.save();
            }
        }
        return "Done";
    }
    catch (err) {
        throw err;
    }
};
exports.startPauseSavings = startPauseSavings;
const endExpiredSavings = async () => {
    try {
        // check for expired record that needs to end
        const allActiveSavings = await (0, Savings_1.getAllUserActiveSavingsRecord)();
        for (const record of allActiveSavings) {
            let pastTomorrow = (0, tools_1.isPastTomorrow)(record.endDate);
            if (pastTomorrow) {
                // check if the contribution is completed
                const allStatus = await (0, Savings_1.getAllContributionStatus)(record.contributionId.toString());
                const isCompleted = (0, tools_1.checkIfContributionIsCompleted)(allStatus);
                if (isCompleted) {
                    record.status = "ENDED";
                    await record.save();
                    // first check if autorenew is on do user can start a new circle
                    if (record.autoRestartEnabled) {
                        await (0, Savings_1.restartSavingsCircle)(record.user.toString(), record.savingsCircleId.toString());
                    }
                    return;
                }
            }
        }
        return "Done";
    }
    catch (err) {
        throw err;
    }
};
exports.endExpiredSavings = endExpiredSavings;
const deductSavingsFromUser = async () => {
    try {
        let todaysDate = new Date();
        // first get all active record first
        const allActiveSavings = await (0, Savings_1.getAllUserActiveSavingsRecord)();
        for (const record of allActiveSavings) {
            const savingsDetails = await (0, Savings_1.checkForCircleById)(record.savingsCircleId.toString());
            let remark = `${savingsDetails?.savingsAmount}N is withdrawn from your account for ${savingsDetails?.savingsTitle} Plan`;
            // check and deduct based on frequency
            if (savingsDetails.frequency === "MONTHLY") {
                if (new Date(savingsDetails.deductionPeriod) === todaysDate) {
                    const withdraw = await (0, User_1.userWithdraw)(record.user.toString(), savingsDetails.savingsAmount, remark);
                    if (withdraw === "Insufficient Funds") {
                        await (0, Savings_1.savingsDeductionSchedule)(record._id.toString(), savingsDetails.savingsAmount, false);
                    }
                    await (0, Savings_1.savingsDeductionSchedule)(record._id.toString(), savingsDetails.savingsAmount, true);
                    return;
                }
            }
            if (savingsDetails.frequency === "WEEKLY") {
                if (savingsDetails.deductionPeriod === (0, tools_1.getDayName)(todaysDate)) {
                    const withdraw = await (0, User_1.userWithdraw)(record.user.toString(), savingsDetails.savingsAmount, remark);
                    if (withdraw === "Insufficient Funds") {
                        await (0, Savings_1.savingsDeductionSchedule)(record._id.toString(), savingsDetails.savingsAmount, false);
                    }
                    await (0, Savings_1.savingsDeductionSchedule)(record._id.toString(), savingsDetails.savingsAmount, true);
                }
            }
            if (savingsDetails.frequency === "DAILY") {
                const withdraw = await (0, User_1.userWithdraw)(record.user.toString(), savingsDetails.savingsAmount, remark);
                if (withdraw === "Insufficient Funds") {
                    await (0, Savings_1.savingsDeductionSchedule)(record._id.toString(), savingsDetails.savingsAmount, false);
                }
                await (0, Savings_1.savingsDeductionSchedule)(record._id.toString(), savingsDetails.savingsAmount, true);
            }
        }
        return "Done";
    }
    catch (err) {
        throw err;
    }
};
exports.deductSavingsFromUser = deductSavingsFromUser;
const savingsDisbursement = async () => {
    try {
        //get all acttive user savings record
        const allActiveSavings = await (0, Savings_1.getAllUserActiveSavingsRecord)();
        for (const record of allActiveSavings) {
            // check if its past  endDate
            let PastEndDate = (0, tools_1.isPastYesterday)(record.endDate);
            if (PastEndDate) {
                // check if the contribution is completed
                const allStatus = await (0, Savings_1.getAllContributionStatus)(record.contributionId.toString());
                const isCompleted = (0, tools_1.checkIfContributionIsCompleted)(allStatus);
                if (isCompleted) {
                    await (0, Savings_1.disburseSavings)(record._id.toString());
                }
            }
            return "done";
        }
    }
    catch (err) {
        throw err;
    }
};
exports.savingsDisbursement = savingsDisbursement;
const fixedSavingsDisbursement = async () => {
    try {
    }
    catch (err) {
        throw err;
    }
};
exports.fixedSavingsDisbursement = fixedSavingsDisbursement;
