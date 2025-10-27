"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSavingsPlan = void 0;
const Savings_1 = __importDefault(require("../model/Savings"));
const Savings_group_1 = __importDefault(require("../model/Savings_group"));
const Admin_config_1 = __importDefault(require("../model/Admin_config"));
const Savings_circle_1 = __importDefault(require("../model/Savings_circle"));
const initSavingsPlan = async (user, subRegion, frequency, savingsAmount, startDate, endDate, status, autoRestartEnabled) => {
    try {
        const { firstTimeAdminFee, defaultPenaltyFee } = await Admin_config_1.default.getSettings();
        const newSavingsPlan = await Savings_1.default.create({
            subRegion,
            frequency,
            savingsAmount,
            firstTimeAdminFee,
            autoRestartEnabled,
            status,
            adminID: user,
        });
        if (!newSavingsPlan) {
            throw { message: "something went wrong" };
        }
        const newSavingsCircle = await Savings_circle_1.default.create({
            savingsPlanId: newSavingsPlan._id,
            frequency,
            savingsAmount,
            startDate,
            endDate,
            status,
        });
        if (!newSavingsCircle) {
            throw { message: "something went wrong, savingplan is created" };
        }
        const newSavingsGroup = await Savings_group_1.default.create({
            savingsId: newSavingsPlan._id,
            savingsCircleId: newSavingsCircle._id,
        });
        if (!newSavingsGroup) {
            throw {
                message: "something went wrong , savingsPlan and savingCircle is created",
            };
        }
        let data = {
            savingsPlanId: newSavingsPlan._id,
            savingsCircleId: newSavingsCircle._id,
            frequency,
            savingsAmount,
            startDate,
            endDate,
            status,
        };
        return data;
    }
    catch (err) {
        throw err;
    }
};
exports.initSavingsPlan = initSavingsPlan;
