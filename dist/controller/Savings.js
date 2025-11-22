"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSavingPlanController = void 0;
const Savings_1 = require("../services/Savings");
const tools_1 = require("../config/tools");
const createSavingPlanController = async (req, res) => {
    try {
        const { subRegion, savingsTitle, frequency, savingsAmount, startDate, deductionPeriod, duration, } = req.body;
        const user = req.user;
        let maturityAmount = (0, tools_1.calculateMaturityAmount)(frequency, duration, savingsAmount, startDate);
        const newSavingsPlan = await (0, Savings_1.initSavingsPlan)(user._id.toString(), subRegion, savingsTitle, frequency, savingsAmount, "ACTIVE", deductionPeriod, duration, maturityAmount);
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.createSavingPlanController = createSavingPlanController;
