"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRegionalAdminToken = exports.verifySuperAdminToken = exports.verifyUserToken = exports.signUserToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_secret = process.env.jwt_secret;
const User_1 = require("../services/User");
const Admin_1 = require("../services/Admin");
const RegionalAdmin_1 = require("../services/RegionalAdmin");
const signUserToken = (user) => {
    const payload = {
        user: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // 2 hours expiry
    };
    return jsonwebtoken_1.default.sign(payload, jwt_secret);
};
exports.signUserToken = signUserToken;
// Middleware to verify client JWT tokens
const verifyUserToken = async (req, res, next) => {
    try {
        // Extract token from authorization header
        const { authorization = "" } = req.headers;
        if (!authorization || authorization === "") {
            return res.json({
                status: "failed!",
                msg: "No authorization token found",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(authorization, jwt_secret);
        const foundId = decoded.user;
        // Find client by decoded user ID
        const currentClient = await (0, User_1.getUserById)(foundId);
        if (!currentClient) {
            return res.json({
                status: "failed!",
                msg: "user not authorized!!",
            });
        }
        // Attach user to request object
        req.user = currentClient;
        return next();
    }
    catch (err) {
        res.json({
            Status: "Failed",
            message: err.message,
        });
    }
};
exports.verifyUserToken = verifyUserToken;
const verifySuperAdminToken = async (req, res, next) => {
    try {
        // Extract token from authorization header
        const { authorization = "" } = req.headers;
        if (!authorization || authorization === "") {
            return res.json({
                status: "failed!",
                msg: "No authorization token found",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(authorization, jwt_secret);
        const foundId = decoded.user;
        // find superadmin by decoded user id
        const currentAdmin = await (0, Admin_1.getAllSuperadminById)(foundId);
        if (!currentAdmin) {
            return res.json({
                status: "failed!",
                msg: "user not authorized!!",
            });
        }
        // Attach user to request object
        req.user = currentAdmin;
        return next();
    }
    catch (err) {
        res.json({
            Status: "Failed",
            message: err.message,
        });
    }
};
exports.verifySuperAdminToken = verifySuperAdminToken;
const verifyRegionalAdminToken = async (req, res, next) => {
    try {
        // Extract token from authorization header
        const { authorization = "" } = req.headers;
        if (!authorization || authorization === "") {
            return res.json({
                status: "failed!",
                msg: "No authorization token found",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(authorization, jwt_secret);
        const foundId = decoded.user;
        const currentAdmin = await (0, RegionalAdmin_1.getRegionalAdminById)(foundId);
        if (!currentAdmin) {
            return res.json({
                status: "failed!",
                msg: "user not authorized!!",
            });
        }
        // Attach user to request object
        req.user = currentAdmin;
        return next();
    }
    catch (err) {
        res.json({
            Status: "Failed",
            message: err.message,
        });
    }
};
exports.verifyRegionalAdminToken = verifyRegionalAdminToken;
