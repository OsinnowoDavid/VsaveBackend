"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgentController = exports.login = void 0;
const argon2_1 = __importDefault(require("argon2"));
const JWT_1 = require("../config/JWT");
const RegionalAdmin_1 = require("../services/RegionalAdmin");
const subRegionalAdmin_1 = require("../services/subRegionalAdmin");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundAdmin = await (0, RegionalAdmin_1.getSubRegionalAdminByEmail)(email);
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
exports.login = login;
const createAgentController = async (req, res) => {
    try {
        const { firstName, lastName, email, subRegion, password, phoneNumber, profilePicture, } = req.body;
        let hashPassword = await argon2_1.default.hash(password);
        const newAgent = await (0, subRegionalAdmin_1.createAgent)(firstName, lastName, email, phoneNumber, subRegion, hashPassword, profilePicture);
        if (!newAgent) {
            return res.json({
                status: "Failed",
                message: "something went wrong",
            });
        }
        return res.json({
            status: "Success",
            message: "Agent account created successfuly",
            data: newAgent,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.createAgentController = createAgentController;
