"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyData = exports.getUserKyc1Record = exports.getDataPlan = exports.buyAirtime = exports.createVirtualAccountIndex = exports.createVirtualAccountForPayment = exports.verifyBankaccount = exports.getAllBanksAndCode = exports.createKYC1Record = exports.kycStatusChange = exports.createKYCRecord = exports.getUserVerificationToken = exports.assignUserEmailVerificationToken = exports.getUserByEmail = exports.getUserById = exports.createNewUser = void 0;
const User_1 = __importDefault(require("../model/User"));
const VerificationToken_1 = __importDefault(require("../model/VerificationToken"));
const KYC1_1 = __importDefault(require("../model/KYC1"));
const KYC_1 = __importDefault(require("../model/KYC"));
const axios_1 = __importDefault(require("axios"));
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
const createNewUser = async (firstName, lastName, email, password, gender, dateOfBirth, phoneNumber) => {
    try {
        const newUser = await User_1.default.create({
            firstName,
            lastName,
            email,
            password,
            gender,
            dateOfBirth,
            phoneNumber,
        });
        return newUser;
    }
    catch (err) {
        throw err;
    }
};
exports.createNewUser = createNewUser;
const getUserById = async (id) => {
    try {
        const foundUser = await User_1.default.findById(id);
        return foundUser;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserById = getUserById;
const getUserByEmail = async (email) => {
    try {
        const foundUser = await User_1.default.findOne({ email });
        return foundUser;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserByEmail = getUserByEmail;
const assignUserEmailVerificationToken = async (email, token, expiresAt) => {
    try {
        const foundUser = await User_1.default.findOne({ email });
        if (!foundUser) {
            throw {
                status: 404,
                message: "User not found",
            };
        }
        const assingToken = await VerificationToken_1.default.create({
            user: foundUser,
            email,
            token,
            expiresAt,
        });
        return assingToken;
    }
    catch (err) {
        throw err;
    }
};
exports.assignUserEmailVerificationToken = assignUserEmailVerificationToken;
const getUserVerificationToken = async (email, token) => {
    try {
        const foundToken = await VerificationToken_1.default.findOne({ email, token });
        return foundToken;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserVerificationToken = getUserVerificationToken;
const createKYCRecord = async (user) => {
    try {
        const newKYC = await KYC_1.default.create({
            user,
            kycStage: 1,
            status: "pending",
        });
        return newKYC;
    }
    catch (err) {
        throw err;
    }
};
exports.createKYCRecord = createKYCRecord;
const kycStatusChange = async (user, status, stage) => {
    try {
        const updatedKYCRecord = await KYC_1.default.findOneAndUpdate({ user: user._id }, { status, kycStage: stage }, { new: true });
        return updatedKYCRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.kycStatusChange = kycStatusChange;
const createKYC1Record = async (user, profession, accountNumber, bank, accountDetails, country, state, bvn, address) => {
    try {
        const newKYC1 = await KYC1_1.default.create({
            user,
            profession,
            accountNumber,
            bank,
            accountDetails,
            country,
            state,
            bvn,
            address,
        });
        const foundUser = await User_1.default.findById(user._id);
        foundUser;
        return newKYC1;
    }
    catch (err) {
        throw err;
    }
};
exports.createKYC1Record = createKYC1Record;
const getAllBanksAndCode = async () => {
    try {
        const response = await axios_1.default.get("https://api.flutterwave.com/v3/banks/NG", {
            headers: {
                Authorization: `Bearer ${FLW_SECRET_KEY}`,
            },
        });
        return response.data.data; // array of banks with codes
    }
    catch (err) {
        throw err;
    }
};
exports.getAllBanksAndCode = getAllBanksAndCode;
const verifyBankaccount = async (accountNumber, bankCode) => {
    try {
        const response = await axios_1.default.post("https://api.flutterwave.com/v3/accounts/resolve", {
            account_number: Number(accountNumber),
            account_bank: bankCode,
        }, {
            headers: {
                Authorization: `Bearer ${FLW_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        });
        console.log("Account Details:", response.data);
        return response.data;
    }
    catch (err) {
        throw err;
    }
};
exports.verifyBankaccount = verifyBankaccount;
const createVirtualAccountForPayment = async (user, bvn, address) => {
    try {
        let getGenderCode = (gender) => {
            if (typeof gender !== "string") {
                throw new Error("Invalid input: expected a string");
            }
            const formatted = gender.trim().toLowerCase();
            if (formatted === "male") {
                return "1";
            }
            else if (formatted === "female") {
                return "2";
            }
            else {
                throw new Error("Invalid gender: must be 'Male' or 'Female'");
            }
        };
        let gender = getGenderCode(user.gender);
        let formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${month}/${day}/${year}`;
        };
        let dob = formatDate(new Date(user.dateOfBirth));
        let data = JSON.stringify({
            customer_identifier: user._id.toString(),
            first_name: user.firstName,
            last_name: user.lastName,
            mobile_num: user.phoneNumber,
            email: user.email,
            bvn,
            dob,
            address,
            gender,
            beneficiary_account: "9006809223",
        });
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://sandbox-api-d.squadco.com/virtual-account",
            headers: {
                Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            data: data,
        };
        console.log("payload:", data);
        const response = await axios_1.default.request(config);
        return response.data;
        // includes virtual_account_number, bank details
    }
    catch (err) {
        // If the request fails, we log the response from the provider
        if (err.response) {
            console.error("Error Response Status:", err.response.status);
            console.error("Error Response Data:", err.response.data);
            throw err.response.data; // Return the exact response data from the provider
        }
        else if (err.request) {
            console.error("No Response:", err.request);
            throw { error: "No response from the server" };
        }
        else {
            console.error("Error:", err.message);
            throw { error: "Unexpected error occurred" };
        }
    }
};
exports.createVirtualAccountForPayment = createVirtualAccountForPayment;
const createVirtualAccountIndex = async (user, account) => {
    try {
        const foundUser = await User_1.default.findByIdAndUpdate(user, {
            virtualAccountNumber: account,
        });
        return foundUser;
    }
    catch (err) {
        throw err;
    }
};
exports.createVirtualAccountIndex = createVirtualAccountIndex;
const buyAirtime = async (phoneNumber, amount) => {
    try {
        const data = {
            phone_number: phoneNumber,
            amount: 5000,
        };
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://sandbox-api-d.squadco.com/vending/purchase/airtime",
            headers: {
                Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            data: data,
        };
        const response = await axios_1.default.request(config);
        return response.data;
    }
    catch (err) {
        throw err;
    }
};
exports.buyAirtime = buyAirtime;
const getDataPlan = async (network) => {
    try {
        let config = {
            method: "Get",
            maxBodyLength: Infinity,
            url: `https://sandbox-api-d.squadco.com/vending/data-bundles?network=${network.toUpperCase()}`,
            headers: {
                Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
        };
        const response = await axios_1.default.request(config);
        return response.data;
    }
    catch (err) {
        throw err;
    }
};
exports.getDataPlan = getDataPlan;
const getUserKyc1Record = async (user) => {
    try {
        const foundKYC1 = await KYC1_1.default.findOne({ user });
        return foundKYC1;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserKyc1Record = getUserKyc1Record;
const buyData = async (phoneNumber, amount, planCode) => {
    try {
        let data = {
            phone_number: phoneNumber,
            amount,
            plan_code: planCode,
        };
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://sandbox-api-d.squadco.com/vending/purchase/data",
            headers: {
                Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            data: data,
        };
        const response = await axios_1.default.request(config);
        return response.data;
    }
    catch (err) {
        throw err;
    }
};
exports.buyData = buyData;
