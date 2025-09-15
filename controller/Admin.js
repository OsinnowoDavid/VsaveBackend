"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminProfile = exports.LoginSuperAdmin = exports.registerAdmin = void 0;
const argon2_1 = __importDefault(require("argon2"));
const Admin_1 = require("../services/Admin");
const JWT_1 = require("../config/JWT");
const registerAdmin = async (req, res) => {
    try {
        const { firstname, lastname, middlename, email, phone_no, password } = req.body;
        let hashPassword = await argon2_1.default.hash(password);
        const newAdmin = await (0, Admin_1.CreateSuperAdmin)(firstname, lastname, email, phone_no, hashPassword, middlename);
        if (!newAdmin) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
        return res.json({
            status: "Failed",
            message: "Regional admin created successfully",
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
exports.registerAdmin = registerAdmin;
const LoginSuperAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundAdmin = await (0, Admin_1.getAllSuperadminByEmail)(email);
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
exports.LoginSuperAdmin = LoginSuperAdmin;
const superAdminProfile = async (req, res) => {
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
exports.superAdminProfile = superAdminProfile;
