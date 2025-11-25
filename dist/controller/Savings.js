"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSavingPlanController = void 0;
const Savings_1 = require("../services/Savings");
const tools_1 = require("../config/tools");
const Admin_config_1 = __importDefault(require("../model/Admin_config"));
const createSavingPlanController = async (req, res) => {
    try {
        const { subRegion, savingsTitle, frequency, savingsAmount, startDate, deductionPeriod, duration, } = req.body;
        const user = req.user;
        const { firstTimeAdminFee } = await Admin_config_1.default.getSettings();
        let maturityAmount = (0, tools_1.calculateMaturityAmount)(frequency, duration, savingsAmount, Number(firstTimeAdminFee));
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
