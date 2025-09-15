"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionalAdminProfile = exports.LoginRegionalAdmin = exports.registerRegionalAdmin = void 0;
const argon2_1 = __importDefault(require("argon2"));
const JWT_1 = require("../config/JWT");
const RegionalAdmin_1 = require("../services/RegionalAdmin");
const registerRegionalAdmin = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, region } = req.body;
        const hashPassword = await argon2_1.default.hash(password);
        const newRegionalAdmin = await (0, RegionalAdmin_1.createRegionalAdmin)(fullName, email, phoneNumber, hashPassword, region);
        if (!newRegionalAdmin) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
        return res.json({
            status: "success",
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
exports.registerRegionalAdmin = registerRegionalAdmin;
const LoginRegionalAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundAdmin = await (0, RegionalAdmin_1.getRegionalAdminByEmail)(email);
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
exports.LoginRegionalAdmin = LoginRegionalAdmin;
const regionalAdminProfile = async (req, res) => {
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
exports.regionalAdminProfile = regionalAdminProfile;
