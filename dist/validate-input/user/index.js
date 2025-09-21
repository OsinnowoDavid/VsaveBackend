"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserKYC1Input = exports.validateUserLoginInput = exports.validateUserRegitrationInput = void 0;
const registration_1 = __importDefault(require("./registration"));
const login_1 = __importDefault(require("./login"));
const userKYC1_1 = __importDefault(require("./userKYC1"));
const validateUserRegitrationInput = (req, res, next) => {
    const { error, isNotValid } = (0, registration_1.default)(req.body);
    // check validation
    if (isNotValid) {
        return res.status(400).json({
            status: "failed",
            isNotValid,
            error,
        });
    }
    else {
        next();
    }
};
exports.validateUserRegitrationInput = validateUserRegitrationInput;
const validateUserLoginInput = (req, res, next) => {
    const { error, isNotValid } = (0, login_1.default)(req.body);
    // check validation
    if (isNotValid) {
        return res.status(400).json({
            status: "failed",
            isNotValid,
            error,
        });
    }
    else {
        next();
    }
};
exports.validateUserLoginInput = validateUserLoginInput;
const validateUserKYC1Input = (req, res, next) => {
    const { error, isNotValid } = (0, userKYC1_1.default)(req.body);
    // check validation
    if (isNotValid) {
        return res.status(400).json({
            status: "failed",
            isNotValid,
            error,
        });
    }
    else {
        next();
    }
};
exports.validateUserKYC1Input = validateUserKYC1Input;
