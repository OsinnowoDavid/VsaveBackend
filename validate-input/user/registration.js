"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const isEmpty_1 = __importDefault(require("../isEmpty"));
const validateRegistrationInput = (data) => {
    let error = {
        fullName: "",
        email: "",
        password: "",
    };
    // Convert undefined/null values to empty strings for validation
    data.fullName = !(0, isEmpty_1.default)(data.fullName) ? data.fullName : "";
    data.email = !(0, isEmpty_1.default)(data.email) ? data.email : "";
    data.password = !(0, isEmpty_1.default)(data.password) ? data.password : "";
    // Validate fullName
    if (validator_1.default.isEmpty(data.fullName)) {
        error.fullName = "fullName field is Required";
    }
    // Validate fullName leNgth
    if (!validator_1.default.isLength(data.fullName, { min: 2, max: 60 })) {
        error.fullName = "fullname must be between 2 to 35 characters.";
    }
    // Validate email
    if (validator_1.default.isEmpty(data.email)) {
        error.email = "email field is Required";
    }
    // Validate email format
    if (!validator_1.default.isEmail(data.email)) {
        error.email = "Email is invalid.";
    }
    // Validate password
    if (validator_1.default.isEmpty(data.password)) {
        error.password = "password field is Required";
    }
    // Validate password length
    if (!validator_1.default.isLength(data.password, { min: 6, max: 30 })) {
        error.password = "password must be at least 6 characters.";
    }
    return {
        error,
        isValid: (0, isEmpty_1.default)(error),
    };
};
exports.default = validateRegistrationInput;
