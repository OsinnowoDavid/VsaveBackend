"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const isEmpty_1 = __importDefault(require("../isEmpty"));
const validateLoginInput = (data) => {
    let error = {
        email: "",
        password: "",
    };
    // Convert undefined/null values to empty strings for validation
    data.email = !(0, isEmpty_1.default)(data.email) ? data.email : "";
    data.password = !(0, isEmpty_1.default)(data.password) ? data.password : "";
    // Validate email
    if (validator_1.default.isEmpty(data.email)) {
        error.email = "email field is Required";
    }
    // Validate email format
    if (!validator_1.default.isEmail(data.email)) {
        error.email = "email is invalid.";
    }
    // Validate password
    if (validator_1.default.isEmpty(data.password)) {
        error.password = "password field is Required";
    }
    // Validate password length
    if (!validator_1.default.isLength(data.password, { min: 6, max: 100 })) {
        error.password = "password must be at least 6 characters.";
    }
    const hasError = (errorObj) => Object.values(errorObj).some((value) => value.trim() !== "");
    return {
        error,
        isNotValid: hasError(error),
    };
};
exports.default = validateLoginInput;
