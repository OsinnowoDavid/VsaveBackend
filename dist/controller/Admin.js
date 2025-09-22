"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewRegionController = exports.createRegionalAdminController = exports.superAdminProfileController = exports.LoginSuperAdminController = exports.registerAdminController = void 0;
const argon2_1 = __importDefault(require("argon2"));
const Admin_1 = require("../services/Admin");
const JWT_1 = require("../config/JWT");
const registerAdminController = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password } = req.body;
        let hashPassword = await argon2_1.default.hash(password);
        const newAdmin = await (0, Admin_1.CreateSuperAdmin)(fullName, email, phoneNumber, hashPassword);
        if (!newAdmin) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
        return res.json({
            status: "Success",
            message: "Super admin created successfully",
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
        const { fullName, email, phoneNumber, password, profilePicture, region } = req.body;
        const newRegionalAdmin = await (0, Admin_1.createRegionalAdmin)(fullName, email, phoneNumber, password, region, profilePicture);
        if (!newRegionalAdmin) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
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
