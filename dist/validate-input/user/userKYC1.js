"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const isEmpty_1 = __importDefault(require("../isEmpty"));
const validateKYC1input = (data) => {
    let error = {
        profession: "",
        accountNumber: "",
        accountDetails: "",
        country: "",
        state: "",
        bvn: "",
    };
    // Convert undefined/null values to empty strings for validation
    data.profession = !(0, isEmpty_1.default)(data.profession) ? data.profession : "";
    data.accountNumber = !(0, isEmpty_1.default)(data.email) ? data.accountNumber : "";
    data.accountDetails = !(0, isEmpty_1.default)(data.accountDetails)
        ? data.accountDetails
        : "";
    data.country = !(0, isEmpty_1.default)(data.country) ? data.country : "";
    data.state = !(0, isEmpty_1.default)(data.state) ? data.state : "";
    data.bvn = !(0, isEmpty_1.default)(data.nin) ? data.nin : "";
    // Validate profession
    if (validator_1.default.isEmpty(data.profession)) {
        error.profession = "profession field is Required";
    }
    // Validate account number
    if (validator_1.default.isNumeric(data.accountNumber)) {
        error.accountNumber =
            "accountNumber field is Required and must be a number not string";
    }
    // Validate account number length
    if (data.accountNumber.length < 10 || data.accountNumber.length > 10) {
        error.accountNumber = "account number must be a valid 10 digit number .";
    }
    // Validate account Details
    if (validator_1.default.isEmpty(data.accountDetails)) {
        error.profession = "accountDetails field is Required";
    }
    //Validate country
    if (validator_1.default.isEmpty(data.country)) {
        error.country = "country field is Required";
    }
    //validate state
    if (validator_1.default.isEmpty(data.state)) {
        error.state = "state field is Required";
    }
    //validate nin
    if (validator_1.default.isEmpty(data.bvn)) {
        error.bvn = "nin field is Required";
    }
    const hasError = (errorObj) => Object.values(errorObj).some((value) => value.trim() !== "");
    return {
        error,
        isNotValid: hasError(error),
    };
};
exports.default = validateKYC1input;
