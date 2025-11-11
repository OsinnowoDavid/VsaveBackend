"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdminRegistrationInput = void 0;
const registration_1 = __importDefault(require("./registration"));
const validateAdminRegistrationInput = (req, res, next) => {
    const { error, isNotValid } = (0, registration_1.default)(req.body);
    // check validation
    if (isNotValid) {
        return res.status(400).json({
            status: "failed",
            message: "inValid Input",
            error,
        });
    }
    else {
        next();
    }
};
exports.validateAdminRegistrationInput = validateAdminRegistrationInput;
