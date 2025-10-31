"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSavingPlanController = void 0;
const Savings_1 = require("../services/Savings");
const tools_1 = require("../config/tools");
const createSavingPlanController = async (req, res) => {
    try {
        const { subRegion, savingsTitle, frequency, savingAmount, startDate, autoRestartEnabled, deductionPeriod, duration, } = req.body;
        const user = req.user;
        let endDate = (0, tools_1.calculateEndDate)(frequency, startDate, duration);
        let maturityAmount = (0, tools_1.calculateMaturityAmount)(frequency, duration, savingAmount, startDate);
        let status = "";
        let currentDate = new Date().toLocaleDateString("en-US");
        console.log("compare:", { startDate, currentDate });
        if (currentDate == startDate) {
            status = "ACTIVE";
        }
        else {
            status = "PENDING";
        }
        const newSavings = await (0, Savings_1.initSavingsPlan)(user._id.toString(), subRegion, savingsTitle, frequency, savingAmount, startDate, endDate, status, autoRestartEnabled, deductionPeriod, duration, maturityAmount);
        return res.json({
            status: "success",
            message: "plan created",
            data: newSavings,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.createSavingPlanController = createSavingPlanController;
