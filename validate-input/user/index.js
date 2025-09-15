"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserRegitrationInput = void 0;
const registration_1 = __importDefault(require("registration"));
const validateUserRegitrationInput = (req, res, next) => {
    const { error, isValid } = (0, registration_1.default)(req.body);
    // check validation
    if (!isValid) {
        return res.status(400).json(error);
    }
    else {
        next();
    }
};
exports.validateUserRegitrationInput = validateUserRegitrationInput;
