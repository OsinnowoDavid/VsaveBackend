"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAgents = exports.createAgents = exports.getAllTeamUnderARegion = exports.getAllTransaction = exports.getSubRegionById = exports.getSubRegionaladminByEmail = exports.getAllSubRegionalAdmin = exports.createSubRegionalAdmin = exports.sendNotification = exports.getAdminSavingsConfig = exports.setAdminSavingsConfig = exports.getTeamByRegion = exports.getAllMyTeam = exports.getAllSubRegion = exports.assignTeamAdminToTeam = exports.assignTeamAdmin = exports.createTeam = exports.getRegionById = exports.getRegionByName = exports.getAllRegion = exports.getRegionalAdminByEmail = exports.getRegionalAdminById = exports.getRegionalAdmins = exports.getAllRegionalAdmin = exports.assignRegionalAdminToRegions = exports.UpdateAdminPassword = exports.updateAdminRecord = exports.assignRegionalAdmin = exports.createRegionalAdmin = exports.createNewRegion = exports.deleteAdmin = exports.createAdminPassword = exports.getAllSuperAdminByEmail = exports.getAdminByRole = exports.getAllAdmin = exports.getAdminByEmail = exports.getAdminById = exports.CreateAdmin = void 0;
const Admin_1 = __importDefault(require("../model/Admin"));
const Region_1 = __importDefault(require("../model/Region"));
const Teams_1 = __importDefault(require("../model/Teams"));
const Admin_config_1 = __importDefault(require("../model/Admin_config"));
const Transaction_1 = __importDefault(require("../model/Transaction"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../model/User"));
const CreateAdmin = async (firstName, lastName, email, phoneNumber, role, profilePicture) => {
    try {
        const newSuperAdmin = await Admin_1.default.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            role,
            profilePicture,
        });
        return newSuperAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.CreateAdmin = CreateAdmin;
const getAdminById = async (id, withpassword) => {
    try {
        if (withpassword) {
            const foundAdmin = await Admin_1.default.findById(id);
            return foundAdmin;
        }
        const foundAdmin = await Admin_1.default.findById(id, { password: 0 });
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getAdminById = getAdminById;
const getAdminByEmail = async (email) => {
    try {
        const foundAdmin = await Admin_1.default.findOne({ email });
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getAdminByEmail = getAdminByEmail;
const getAllAdmin = async () => {
    try {
        const allAdmin = await Admin_1.default.find();
        return allAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllAdmin = getAllAdmin;
const getAdminByRole = async (role) => {
    try {
        const admins = await Admin_1.default.find({ role: role.toUpperCase() });
        return admins;
    }
    catch (err) {
        throw err;
    }
};
exports.getAdminByRole = getAdminByRole;
const getAllSuperAdminByEmail = async (email) => {
    try {
        const foundAdmin = await Admin_1.default.findOne({ email, role: "SUPER ADMIN" });
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllSuperAdminByEmail = getAllSuperAdminByEmail;
const createAdminPassword = async (admin, password) => {
    try {
        const foundAdmin = await Admin_1.default.findById(admin);
        foundAdmin.password = password;
        foundAdmin.isEmailVerified = true;
        await foundAdmin.save();
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.createAdminPassword = createAdminPassword;
const deleteAdmin = async (id) => {
    try {
        const deletedRecord = await Admin_1.default.findByIdAndDelete(id);
        return "Done";
    }
    catch (err) {
        throw err;
    }
};
exports.deleteAdmin = deleteAdmin;
const createNewRegion = async (regionName, location, admin, shortCode) => {
    try {
        const newRegion = await Region_1.default.create({
            regionName,
            shortCode,
            location
        });
        if (admin) {
            const foundAdmin = await Admin_1.default.findByIdAndUpdate(admin, { region: newRegion._id });
            newRegion.admin.push(foundAdmin._id);
            await newRegion.save();
        }
        return newRegion;
    }
    catch (err) {
        throw err;
    }
};
exports.createNewRegion = createNewRegion;
const createRegionalAdmin = async (firstName, lastName, email, phoneNumber, password, region, profilePicture) => {
    try {
        const newRegionalAdmin = await Admin_1.default.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            region,
            role: "REGIONAL ADMIN",
            profilePicture,
        });
        return newRegionalAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.createRegionalAdmin = createRegionalAdmin;
const assignRegionalAdmin = async (admin, region) => {
    try {
        for (const id of region) {
            const foundRegion = await Region_1.default.findById(id);
            if (!foundRegion) {
                throw "region not found !";
            }
            foundRegion.admin.push(admin._id);
            await foundRegion.save();
        }
        return 'Done';
    }
    catch (err) {
        throw err;
    }
};
exports.assignRegionalAdmin = assignRegionalAdmin;
const updateAdminRecord = async (id, firstName, lastName, email, phoneNumber) => {
    try {
        const foundAdmin = await Admin_1.default.findByIdAndUpdate(id, { firstName, lastName, email, phoneNumber });
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.updateAdminRecord = updateAdminRecord;
const UpdateAdminPassword = async (id, password) => {
    try {
        const foundAdmin = await Admin_1.default.findByIdAndUpdate(id, { password });
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.UpdateAdminPassword = UpdateAdminPassword;
const assignRegionalAdminToRegions = async (region, regionalAdmin) => {
    try {
        const foundAdmin = await Admin_1.default.findById(regionalAdmin);
        for (const id of region) {
            if (foundAdmin.region.length > 10) {
                throw { message: "Regional Admin already assigned to 10 region" };
            }
            foundAdmin.region.push(id);
        }
        await foundAdmin.save();
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.assignRegionalAdminToRegions = assignRegionalAdminToRegions;
const getAllRegionalAdmin = async () => {
    try {
        const allRegionalAdmin = await Admin_1.default.find();
        return allRegionalAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllRegionalAdmin = getAllRegionalAdmin;
const getRegionalAdmins = async (region) => {
    try {
        const foundRecord = await Admin_1.default.find({ region });
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getRegionalAdmins = getRegionalAdmins;
const getRegionalAdminById = async (id) => {
    try {
        const foundAdmin = await Admin_1.default.findOne({ id, role: "REGIONAL ADMIN" });
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getRegionalAdminById = getRegionalAdminById;
const getRegionalAdminByEmail = async (email) => {
    try {
        const foundAdmin = await Admin_1.default.findOne({ email });
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.getRegionalAdminByEmail = getRegionalAdminByEmail;
const getAllRegion = async () => {
    try {
        const allRegion = await Region_1.default.find().populate({ path: "admin", select: "-password" });
        return allRegion;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllRegion = getAllRegion;
const getRegionByName = async (regionName) => {
    try {
        const foundRegion = await Region_1.default.findOne({ regionName });
        return foundRegion;
    }
    catch (err) {
        throw err;
    }
};
exports.getRegionByName = getRegionByName;
const getRegionById = async (id) => {
    try {
        const foundRecord = await Region_1.default.findById(id);
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getRegionById = getRegionById;
const createTeam = async (teamName, location, region, admin, shortCode) => {
    try {
        let adminId = new mongoose_1.default.Types.ObjectId(admin);
        const newSubRegion = await Teams_1.default.create({
            teamName,
            location,
            region,
            shortCode,
            admin: adminId
        });
        const foundRegion = await Region_1.default.findById(region);
        foundRegion.teams.push(newSubRegion._id);
        await foundRegion.save();
        const foundAdmin = await Admin_1.default.findByIdAndUpdate(adminId, { team: newSubRegion._id });
        newSubRegion.admin.push(foundAdmin._id);
        await newSubRegion.save();
        return newSubRegion;
    }
    catch (err) {
        throw err;
    }
};
exports.createTeam = createTeam;
const assignTeamAdmin = async (admin, subRegion) => {
    try {
        const foundAdmin = await Admin_1.default.findById(admin);
        for (const record of subRegion) {
            const foundSubRegion = await Teams_1.default.findById(record);
            if (!foundSubRegion) {
                throw { Message: "no sub region found with this ID" };
            }
            foundAdmin.team.push(record);
        }
        await foundAdmin.save();
        return foundAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.assignTeamAdmin = assignTeamAdmin;
const assignTeamAdminToTeam = async (admin, subRegion) => {
    try {
        for (const id of subRegion) {
            const foundSubRegion = await Teams_1.default.findById(id);
            if (!foundSubRegion) {
                throw { message: "no sub region found with this ID" };
            }
            foundSubRegion.admin.push(admin._id);
            await foundSubRegion.save();
        }
        return 'Done';
    }
    catch (err) {
        throw err;
    }
};
exports.assignTeamAdminToTeam = assignTeamAdminToTeam;
const getAllSubRegion = async () => {
    try {
        const foundRecord = await Teams_1.default.find();
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllSubRegion = getAllSubRegion;
const getAllMyTeam = async (admin) => {
    try {
        const foundAdmin = await Admin_1.default.findById(admin);
        let result = [];
        if (foundAdmin.role === "TEAM ADMIN") {
            for (const record of foundAdmin.team) {
                const foundArea = await Teams_1.default.findById(record).populate([
                    { path: "admin", select: "-password" },
                    { path: "region" }
                ]);
                result.push(foundArea);
            }
            return result;
        }
        if (foundAdmin.role === "REGIONAL ADMIN") {
            for (const record of foundAdmin.region) {
                const foundRegion = await Region_1.default.findById(record);
                for (const areaRecord of foundRegion.teams) {
                    const foundArea = await Teams_1.default.findById(areaRecord).populate({ path: "admin", select: "-password" });
                    result.push(foundArea);
                }
            }
            return result;
        }
        const allArea = await Teams_1.default.find().populate({ path: "admin", select: "-password" });
        return allArea;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllMyTeam = getAllMyTeam;
const getTeamByRegion = async (region) => {
    try {
        const foundRecord = await Teams_1.default.find({ region });
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getTeamByRegion = getTeamByRegion;
const setAdminSavingsConfig = async (defaultPenaltyFee, firstTimeAdminFee, loanPenaltyFee, fixedSavingsAnualInterest, fixedSavingsPenaltyFee, terminalBonus) => {
    try {
        const configSettings = await Admin_config_1.default.getSettings();
        configSettings.defaultPenaltyFee = defaultPenaltyFee;
        configSettings.firstTimeAdminFee = firstTimeAdminFee;
        configSettings.loanPenaltyFee = loanPenaltyFee;
        configSettings.fixedSavingsAnualInterest = fixedSavingsAnualInterest;
        configSettings.fixedSavingsPenaltyFee = fixedSavingsPenaltyFee;
        configSettings.terminalBonus = terminalBonus;
        await configSettings.save();
        return configSettings;
    }
    catch (err) {
        throw err;
    }
};
exports.setAdminSavingsConfig = setAdminSavingsConfig;
const getAdminSavingsConfig = async () => {
    try {
        const configSettngs = await Admin_config_1.default.getSettings();
        return configSettngs;
    }
    catch (err) {
        throw err;
    }
};
exports.getAdminSavingsConfig = getAdminSavingsConfig;
const sendNotification = async (to, recipientId, title, message) => {
    try {
    }
    catch (err) {
        throw err;
    }
};
exports.sendNotification = sendNotification;
const createSubRegionalAdmin = async (firstName, lastName, email, phoneNumber, password, region, subRegion, profilePicture) => {
    try {
        const newSubRegionalAdmin = await Admin_1.default.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            region,
            subRegion,
            role: "SUBREGIONAL ADMIN",
            profilePicture,
        });
        return newSubRegionalAdmin;
    }
    catch (err) {
        throw err;
    }
};
exports.createSubRegionalAdmin = createSubRegionalAdmin;
const getAllSubRegionalAdmin = async (subRegion) => {
    try {
        const foundRecord = await Admin_1.default.find({ subRegion });
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllSubRegionalAdmin = getAllSubRegionalAdmin;
const getSubRegionaladminByEmail = async (email, subRegion) => {
    try {
        const foundAdmin = await Admin_1.default.findOne({
            email,
            subRegion
        });
    }
    catch (err) {
        throw err;
    }
};
exports.getSubRegionaladminByEmail = getSubRegionaladminByEmail;
const getSubRegionById = async (id) => {
    try {
        const foundRecord = await Teams_1.default.findById(id);
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getSubRegionById = getSubRegionById;
const getAllTransaction = async () => {
    try {
        const allTransaction = await Transaction_1.default.find();
        return allTransaction;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllTransaction = getAllTransaction;
const getAllTeamUnderARegion = async (region) => {
    try {
        const foundTeams = await Teams_1.default.find({ region });
        return foundTeams;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllTeamUnderARegion = getAllTeamUnderARegion;
const createAgents = async (firstName, lastName, email, password, gender, dateOfBirth, phoneNumber, region, team) => {
    try {
        const newUser = await User_1.default.create({
            firstName,
            lastName,
            email,
            password,
            gender,
            dateOfBirth,
            phoneNumber,
            region,
            team,
            role: "AGENT"
        });
        return newUser;
    }
    catch (err) {
        throw err;
    }
};
exports.createAgents = createAgents;
const getAllAgents = async () => {
    try {
        const foundRecord = await User_1.default.find({ role: "AGENT" });
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllAgents = getAllAgents;
