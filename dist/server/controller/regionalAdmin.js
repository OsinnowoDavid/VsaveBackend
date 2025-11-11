"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubRegionByIdController = exports.getAllSubRegionController = exports.createSubRegionalAdmincontroller = exports.createSubRegionController = exports.regionalAdminProfile = exports.LoginRegionalAdmin = void 0;
const argon2_1 = __importDefault(require("argon2"));
const JWT_1 = require("../config/JWT");
const RegionalAdmin_1 = require("../services/RegionalAdmin");
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
const createSubRegionController = async (req, res) => {
    try {
        const { subRegionName, shortCode, region } = req.body;
        const newSubRegion = await (0, RegionalAdmin_1.createSubRegion)(subRegionName, shortCode, region.toString());
        if (!newSubRegion) {
            return res.json({
                status: "Failed",
                message: "something went wrong try agian later",
            });
        }
        await (0, RegionalAdmin_1.assignSubRegionToRegion)(region.toString(), newSubRegion);
        return res.json({
            status: "Success",
            message: "SubRegion created successfuly",
            data: newSubRegion,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.createSubRegionController = createSubRegionController;
const createSubRegionalAdmincontroller = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, subRegion } = req.body;
        let hashPassword = await argon2_1.default.hash(password);
        const newSubRegionalAdmin = await (0, RegionalAdmin_1.createSubRegionalAdmin)(firstName, lastName, email, hashPassword, phoneNumber, subRegion);
        if (!newSubRegionalAdmin) {
            return res.json({
                status: "Failed",
                message: "something went wrong try agian later",
            });
        }
        await (0, RegionalAdmin_1.assignSubRegionAdmin)(newSubRegionalAdmin, subRegion.toString());
        return res.json({
            status: "Success",
            message: "SubRegion created successfuly",
            data: newSubRegionalAdmin,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.createSubRegionalAdmincontroller = createSubRegionalAdmincontroller;
const getAllSubRegionController = async (req, res) => {
    try {
        const allSubRegion = await (0, RegionalAdmin_1.getAllSubRegion)();
        if (!allSubRegion) {
            return res.json({
                status: "Failed",
                message: "No SubRegion Found",
            });
        }
        return res.json({
            status: "Success",
            message: "Found SubRegion",
            data: allSubRegion,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getAllSubRegionController = getAllSubRegionController;
const getSubRegionByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const foundSubRegion = await (0, RegionalAdmin_1.getSubRegionById)(id);
        if (!foundSubRegion) {
            return res.json({
                status: "Failed",
                message: "something went wrong try agian later",
            });
        }
        return res.json({
            status: "Success",
            message: "SubRegion created successfuly",
            data: foundSubRegion,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getSubRegionByIdController = getSubRegionByIdController;
