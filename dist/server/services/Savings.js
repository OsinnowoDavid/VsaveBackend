"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserPersonalSavings = exports.renewSavingsCircle = exports.endSavings = exports.getActiveSavingsGroupByCircleId = exports.getSavingsGroupByCircleId = exports.getAllActiveSavingsGroup = exports.getCurrentActiveSavingsCircle = exports.getAllSavingsPlanCircle = exports.getAllActiveSavingsPlanCircle = exports.getAllActiveSavingsPlan = exports.getAllSavingsPlan = exports.getSavingsById = exports.getCircleById = exports.initSavingsPlan = void 0;
const Savings_1 = __importDefault(require("../model/Savings"));
const Savings_group_1 = __importDefault(require("../model/Savings_group"));
const Admin_config_1 = __importDefault(require("../model/Admin_config"));
const Savings_circle_1 = __importDefault(require("../model/Savings_circle"));
const User_savings_record_1 = __importDefault(require("../model/User_savings_record"));
const User_savings_circle_1 = __importDefault(require("../model/User_savings_circle"));
const initSavingsPlan = async (user, subRegion, savingsTitle, frequency, savingsAmount, startDate, endDate, status, autoRestartEnabled, deductionPeriod, duration, maturityAmount) => {
    try {
        const { firstTimeAdminFee, defaultPenaltyFee } = await Admin_config_1.default.getSettings();
        const newSavingsPlan = await Savings_1.default.create({
            savingsTitle,
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
            subRegion,
            savingsTitle,
            savingsPlanId: newSavingsPlan._id,
            frequency,
            savingsAmount,
            startDate,
            endDate,
            duration,
            status,
            deductionPeriod,
            maturityAmount,
        });
        if (!newSavingsCircle) {
            throw { message: "something went wrong, savingplan is created" };
        }
        const newSavingsGroup = await Savings_group_1.default.create({
            subRegion,
            status,
            duration,
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
const getSavingsById = async (id) => {
    try {
        const foundSavings = await Savings_1.default.findById(id);
        return foundSavings;
    }
    catch (err) {
        throw err;
    }
};
exports.getSavingsById = getSavingsById;
const getAllSavingsPlan = async () => {
    try {
        const allSavingsPlan = await Savings_1.default.find();
        return allSavingsPlan;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllSavingsPlan = getAllSavingsPlan;
const getAllActiveSavingsPlan = async () => {
    try {
        const allActiveSavingsPlan = await Savings_1.default.find({ status: "ACTIVE" });
        return allActiveSavingsPlan;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllActiveSavingsPlan = getAllActiveSavingsPlan;
const getAllActiveSavingsPlanCircle = async () => {
    try {
        const allActiveCircle = await Savings_circle_1.default.find({ status: "ACTIVE" });
        return allActiveCircle;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllActiveSavingsPlanCircle = getAllActiveSavingsPlanCircle;
const getAllSavingsPlanCircle = async (savingsPlanId) => {
    try {
        const allSavingsCircle = await Savings_circle_1.default.find({ savingsPlanId });
        return allSavingsCircle;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllSavingsPlanCircle = getAllSavingsPlanCircle;
const getCurrentActiveSavingsCircle = async (savingsPlanId) => {
    try {
        const currentActiveCircle = await Savings_circle_1.default.findOne({
            savingsPlanId,
            status: "ACTIVE",
        });
        return currentActiveCircle;
    }
    catch (err) {
        throw err;
    }
};
exports.getCurrentActiveSavingsCircle = getCurrentActiveSavingsCircle;
const getAllActiveSavingsGroup = async () => {
    try {
        const allActiveSavingGroup = await Savings_group_1.default.find({
            status: "ACTIVE",
        });
        return allActiveSavingGroup;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllActiveSavingsGroup = getAllActiveSavingsGroup;
const getSavingsGroupByCircleId = async (circleId) => {
    try {
        const savingsGroup = await Savings_group_1.default.findOne({
            savingsCircleId: circleId,
        });
        return savingsGroup;
    }
    catch (err) {
        throw err;
    }
};
exports.getSavingsGroupByCircleId = getSavingsGroupByCircleId;
const getActiveSavingsGroupByCircleId = async (circleId) => {
    try {
        const savingsGroup = await Savings_group_1.default.findOne({
            savingsCircleId: circleId,
            status: "ACTIVE",
        });
        return savingsGroup;
    }
    catch (err) {
        throw err;
    }
};
exports.getActiveSavingsGroupByCircleId = getActiveSavingsGroupByCircleId;
const endSavings = async (savingsId) => {
    try {
        // end savings group
        const foundSavingsGroup = (await Savings_group_1.default.findOne({
            savingsId,
        }));
        foundSavingsGroup.status = "ENDED";
        await foundSavingsGroup.save();
        //also end savings circle
        const foundCircle = (await Savings_circle_1.default.findOne({
            savingsPlanId: savingsId,
            status: "ACTIVE",
        }));
        foundCircle.status = "ENDED";
        await foundCircle.save();
        //also end savings plan
        const foundSavingsPlan = (await Savings_1.default.findById(savingsId));
        foundSavingsPlan.status = "ENDED";
        await foundSavingsPlan.save();
        // lastly end userSavingsRecord
        const foundUserSavingsRecord = (await User_savings_record_1.default.findOne({
            savingsId,
            status: "ACTIVE",
        }));
        foundUserSavingsRecord.status = "ENDED";
        await foundUserSavingsRecord.save();
        return foundSavingsPlan;
    }
    catch (err) {
        throw err;
    }
};
exports.endSavings = endSavings;
const renewSavingsCircle = async (savingsId) => {
    try {
        // end savings group
        const foundSavingsGroup = (await Savings_group_1.default.findOne({
            savingsId,
        }));
        foundSavingsGroup.status = "ENDED";
        await foundSavingsGroup.save();
        //also end savings circle
        const foundCircle = (await Savings_circle_1.default.findOne({
            savingsPlanId: savingsId,
        }));
        foundCircle.status = "ENDED";
        await foundCircle.save();
        // also end user
    }
    catch (err) {
        throw err;
    }
};
exports.renewSavingsCircle = renewSavingsCircle;
const createUserPersonalSavings = async (user, savingsTitle, frequency, duration, deductionPeriod, savingsAmount, startDate, endDate, status, maturityAmount, autoRestartEnabled) => {
    try {
        const { firstTimeAdminFee } = await Admin_config_1.default.getSettings();
        const newSavingsCircle = await User_savings_circle_1.default.create({
            user,
            savingsTitle,
            frequency,
            duration,
            deductionPeriod,
            firstTimeAdminFee,
            savingsAmount,
            startDate,
            endDate,
            status,
            autoRestartEnabled,
            maturityAmount,
        });
        const newSavingsRecord = await User_savings_record_1.default.create({
            user,
            savingsCircleId: newSavingsCircle._id,
            maturityAmount,
            status,
        });
        return { newSavingsCircle, newSavingsRecord };
    }
    catch (err) {
        throw err;
    }
};
exports.createUserPersonalSavings = createUserPersonalSavings;
