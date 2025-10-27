"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminSavingsConfigController = exports.setAdminConfigController = exports.getRegionalAdminByEmailController = exports.getAllRegionalAdminController = exports.getAllRegionController = exports.createNewRegionController = exports.createRegionalAdminController = exports.superAdminProfileController = exports.LoginSuperAdminController = exports.registerAdminController = void 0;
const argon2_1 = __importDefault(require("argon2"));
const Admin_1 = require("../services/Admin");
const JWT_1 = require("../config/JWT");
const registerAdminController = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password } = req.body;
        let hashPassword = await argon2_1.default.hash(password);
        const newAdmin = await (0, Admin_1.CreateSuperAdmin)(firstName, lastName, email, phoneNumber, hashPassword);
        if (!newAdmin) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
        return res.json({
            Status: "success",
            message: "SuperAdmin Account created successfuly",
            data: newAdmin,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.registerAdminController = registerAdminController;
const LoginSuperAdminController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundAdmin = await (0, Admin_1.getAllSuperAdminByEmail)(email);
        if (!foundAdmin) {
            return res.json({
                status: "Failed",
                message: "User Not Found",
            });
        }
        let verifyPassword = await argon2_1.default.verify(foundAdmin.password, password);
        if (!verifyPassword) {
            return res.json({
                status: "Failed",
                message: "incorrect Passsword",
            });
        }
        // Return success with JWT token
        return res.json({
            Status: "success",
            message: "login successfuly",
            token: (0, JWT_1.signUserToken)(foundAdmin),
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.LoginSuperAdminController = LoginSuperAdminController;
const superAdminProfileController = async (req, res) => {
    try {
        let user = req.user;
        if (!user) {
            return res.json({
                Status: "Failed",
                message: "user not found",
            });
        }
        return res.json({
            Status: "success",
            message: "welcome back",
            data: user,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.superAdminProfileController = superAdminProfileController;
const createRegionalAdminController = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password, region, profilePicture, } = req.body;
        let hashPassword = await argon2_1.default.hash(password);
        const newRegionalAdmin = await (0, Admin_1.createRegionalAdmin)(firstName, lastName, email, phoneNumber, hashPassword, region.toString(), profilePicture);
        if (!newRegionalAdmin) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
        // assing regional admin to is region
        await (0, Admin_1.assignRegionalAdmin)(newRegionalAdmin, region);
        return res.json({
            status: "Success",
            message: "Regional admin created successfully",
            data: newRegionalAdmin,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.createRegionalAdminController = createRegionalAdminController;
const createNewRegionController = async (req, res) => {
    try {
        const { regionName, shortCode } = req.body;
        const newRegion = await (0, Admin_1.createNewRegion)(regionName, shortCode);
        if (!newRegion) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
        return res.json({
            status: "Success",
            message: "Region  created successfully",
            data: newRegion,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.createNewRegionController = createNewRegionController;
const getAllRegionController = async (req, res) => {
    try {
        const allRegion = await (0, Admin_1.getAllRegion)();
        if (!allRegion) {
            return res.json({
                status: "Failed",
                message: "No Region Found",
            });
        }
        return res.json({
            status: "Success",
            message: "Region Found",
            data: allRegion,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getAllRegionController = getAllRegionController;
const getAllRegionalAdminController = async (req, res) => {
    try {
        const allRegionalAdmin = await (0, Admin_1.getAllRegionalAdmin)();
        if (!allRegionalAdmin) {
            return res.json({
                status: "Failed",
                message: "No Region Found",
            });
        }
        return res.json({
            status: "Success",
            message: "Region Found",
            data: allRegionalAdmin,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getAllRegionalAdminController = getAllRegionalAdminController;
const getRegionalAdminByEmailController = async (req, res) => {
    try {
        const { email } = req.params;
        const foundRegionalAdmin = await (0, Admin_1.getRegionalAdminByEmail)(email);
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getRegionalAdminByEmailController = getRegionalAdminByEmailController;
const setAdminConfigController = async (req, res) => {
    try {
        const { defaultPenaltyFee, firstTimeAdminFee } = req.body;
        const config = await (0, Admin_1.setAdminSavingsConfig)(defaultPenaltyFee, firstTimeAdminFee);
        if (!config) {
            return res.json({
                status: "Failed",
                message: "something went wrong",
            });
        }
        return res.json({
            status: "Success",
            message: "record updated",
            data: config,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.setAdminConfigController = setAdminConfigController;
const getAdminSavingsConfigController = async (req, res) => {
    try {
        const configSettings = await (0, Admin_1.getAdminSavingsConfig)();
        return res.json({
            status: "Success",
            message: "config setting",
            data: configSettings,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getAdminSavingsConfigController = getAdminSavingsConfigController;
