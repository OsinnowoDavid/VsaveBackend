"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSavingPlanController = void 0;
const Savings_1 = require("../services/Savings");
const createSavingPlanController = async (req, res) => {
    try {
        const { subRegion, frequency, savingAmount, startDate, endDate, status, autoRestartEnabled, } = req.body;
        const user = req.user;
        const newSavings = await (0, Savings_1.initSavingsPlan)(user._id.toString(), subRegion, frequency, savingAmount, startDate, endDate, status, autoRestartEnabled);
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
