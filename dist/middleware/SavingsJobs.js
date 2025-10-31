"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateExpiredSavings = exports.textNodeCron = exports.deductSavingsFromUser = void 0;
const Savings_1 = require("../services/Savings");
const User_1 = require("../services/User");
const Bank_code_1 = __importDefault(require("../model/Bank_code"));
const tools_1 = require("../config/tools");
const checkPlanForUserDeduction = async (plan) => {
    for (const user of plan.users) {
        let dateFormat = new Date();
        let todaysDate = `${(dateFormat.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${dateFormat
            .getDate()
            .toString()
            .padStart(2, "0")}/${dateFormat.getFullYear()}`;
        const savingsDetails = (await (0, Savings_1.getCircleById)(plan.savingsCircleId));
        let remark = `${savingsDetails?.savingsAmount}N is withdrawn from your account for ${savingsDetails?.savingsTitle} Plan`;
        // check and deduct based on frequency
        if (savingsDetails.frequency === "MONTHLY") {
            if (savingsDetails.deductionPeriod === todaysDate) {
                const withdraw = await (0, User_1.userWithdraw)(user, savingsDetails.savingsAmount, remark);
                if (withdraw === "Insufficient Funds") {
                    await (0, User_1.updateUserSavingsRecords)(user, plan.savingsCircleId, savingsDetails.savingsAmount, plan.periods, "pending");
                    return;
                }
                await (0, User_1.updateUserSavingsRecords)(user, plan.savingsCircleId, savingsDetails.savingsAmount, plan.periods, "paid");
            }
            else {
                return;
            }
        }
        else if ((savingsDetails.frequency = "WEEKLY")) {
            if (savingsDetails.deductionPeriod === (0, tools_1.getDayName)(todaysDate)) {
                const withdraw = await (0, User_1.userWithdraw)(user, savingsDetails.savingsAmount, remark);
                if (withdraw === "Insufficient Funds") {
                    await (0, User_1.updateUserSavingsRecords)(user, plan.savingsCircleId, savingsDetails.savingsAmount, plan.periods, "pending");
                    return;
                }
                await (0, User_1.updateUserSavingsRecords)(user, plan.savingsCircleId, savingsDetails.savingsAmount, plan.periods, "paid");
            }
            else {
                return;
            }
        }
        else {
            const withdraw = await (0, User_1.userWithdraw)(user, savingsDetails.savingsAmount, remark);
            if (withdraw === "Insufficient Funds") {
                await (0, User_1.updateUserSavingsRecords)(user, plan.savingsCircleId, savingsDetails.savingsAmount, plan.periods, "pending");
                return;
            }
            await (0, User_1.updateUserSavingsRecords)(user, plan.savingsCircleId, savingsDetails.savingsAmount, plan.periods, "paid");
        }
    }
};
const deductSavingsFromUser = async () => {
    try {
        const activePlan = await (0, Savings_1.getAllActiveSavingsGroup)();
        for (const plan of activePlan) {
            await checkPlanForUserDeduction(plan);
        }
    }
    catch (err) {
        console.log("job error:", err.message, "date:", new Date());
    }
};
exports.deductSavingsFromUser = deductSavingsFromUser;
const textNodeCron = async () => {
    try {
        console.log("got to 10:20 node cron job");
        await Bank_code_1.default.create({ bankCode: "texting", bank: "textings" });
    }
    catch (err) {
        throw err;
    }
};
exports.textNodeCron = textNodeCron;
const deactivateExpiredSavings = async () => {
    try {
    }
    catch (err) {
        console.log("job error:", err.message, "date:", new Date());
    }
};
exports.deactivateExpiredSavings = deactivateExpiredSavings;
