"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGetAllSubRegion = exports.joinSavings = exports.getUserTransactionByType = exports.getUserTransactionByStatus = exports.getUserSingleTransaction = exports.getUserTransactions = exports.payOut = exports.accountLookUp = exports.getBankCode = exports.createUserAirtimeTransaction = exports.createUserDataTransaction = exports.checkTransferByRefrence = exports.createUserTransaction = exports.deposit = exports.withdraw = exports.buyData = exports.getUserKyc1Record = exports.getDataPlan = exports.buyAirtime = exports.createVirtualAccountIndex = exports.createVirtualAccountForPayment = exports.verifyBankaccount = exports.getAllBanksAndCode = exports.updateKYC1Record = exports.createKYC1Record = exports.kycStatusChange = exports.createKYCRecord = exports.getUserVerificationToken = exports.assignUserEmailVerificationToken = exports.getUserByEmail = exports.getUserById = exports.createNewUser = void 0;
const User_1 = __importDefault(require("../model/User"));
const VerificationToken_1 = __importDefault(require("../model/VerificationToken"));
const KYC1_1 = __importDefault(require("../model/KYC1"));
const KYC_1 = __importDefault(require("../model/KYC"));
const Transaction_1 = __importDefault(require("../model/Transaction"));
const axios_1 = __importDefault(require("axios"));
const Bank_code_1 = __importDefault(require("../model/Bank_code"));
const Savings_group_1 = __importDefault(require("../model/Savings_group"));
const User_savings_record_1 = __importDefault(require("../model/User_savings_record"));
const Savings_circle_1 = __importDefault(require("../model/Savings_circle"));
const RegionalAdmin_1 = require("./RegionalAdmin");
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
const generateRefrenceCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    let marchantId = process.env.MARCHANT_ID;
    for (let i = 0; i < 15; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    return `${marchantId}_${code}`;
};
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
const createKYC1Record = async (user, profession, accountNumber, bank, accountDetails, country, state, bvn, address, subRegion) => {
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
        const foundUser = (await User_1.default.findById(user._id));
        foundUser.subRegion = subRegion;
        await foundUser.save();
        return newKYC1;
    }
    catch (err) {
        throw err;
    }
};
exports.createKYC1Record = createKYC1Record;
const updateKYC1Record = async (user, bank) => {
    try {
        const foundUser = await KYC1_1.default.findOneAndUpdate({ user: user._id }, {});
    }
    catch (err) {
        throw err;
    }
};
exports.updateKYC1Record = updateKYC1Record;
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
let formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};
const createVirtualAccountForPayment = async (user, bvn, address) => {
    try {
        let gender = getGenderCode(user.gender);
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
            amount,
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
        console.log("squadres", response.data);
        return response.data;
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
exports.buyData = buyData;
const withdraw = async (user, amount) => {
    try {
        const foundUser = (await User_1.default.findById(user._id));
        foundUser.availableBalance -= amount;
        await foundUser.save();
        return foundUser;
    }
    catch (err) {
        throw err;
    }
};
exports.withdraw = withdraw;
const deposit = async (user, amount) => {
    try {
        const foundUser = (await User_1.default.findById(user._id));
        foundUser.availableBalance += amount;
        await foundUser.save();
        return foundUser;
    }
    catch (err) {
        throw err;
    }
};
exports.deposit = deposit;
const createUserTransaction = async (user, type, transactionReference, amount, balanceBefore, balanceAfter, remark, status, date, sender, reciever, feeCharged) => {
    try {
        const foundUser = (await User_1.default.findById(user));
        const newTransaction = await Transaction_1.default.create({
            userId: foundUser._id,
            type,
            transactionReference,
            amount,
            balanceBefore,
            balanceAfter,
            status,
            remark,
            sender,
            reciever,
            date,
            feeCharged,
        });
        return newTransaction;
    }
    catch (err) {
        throw err;
    }
};
exports.createUserTransaction = createUserTransaction;
const checkTransferByRefrence = async (refrence) => {
    try {
        const foundTransaction = await Transaction_1.default.findOne({
            transactionReference: refrence,
        });
        return foundTransaction;
    }
    catch (err) {
        throw err;
    }
};
exports.checkTransferByRefrence = checkTransferByRefrence;
const createUserDataTransaction = async (user, transactionReference, amount, balanceBefore, balanceAfter, reciever, network, bundle, feeCharged) => {
    try {
        const foundUser = (await User_1.default.findById(user));
        const newTransaction = await Transaction_1.default.create({
            userId: foundUser._id,
            type: "data",
            transactionReference,
            amount,
            balanceBefore,
            balanceAfter,
            status: "success",
            reciever,
            date: new Date(),
            network,
            feeCharged,
            bundle,
        });
        return newTransaction;
    }
    catch (err) {
        throw err;
    }
};
exports.createUserDataTransaction = createUserDataTransaction;
const createUserAirtimeTransaction = async (user, transactionReference, amount, balanceBefore, balanceAfter, reciever, network, feeCharged) => {
    try {
        const foundUser = (await User_1.default.findById(user));
        const newTransaction = await Transaction_1.default.create({
            userId: foundUser._id,
            type: "airtime",
            transactionReference,
            amount,
            balanceBefore,
            balanceAfter,
            status: "success",
            reciever,
            date: new Date(),
            network,
            feeCharged,
        });
        return newTransaction;
    }
    catch (err) {
        throw err;
    }
};
exports.createUserAirtimeTransaction = createUserAirtimeTransaction;
const getBankCode = async () => {
    try {
        const allBankCode = await Bank_code_1.default.find();
        return allBankCode;
    }
    catch (err) {
        throw err;
    }
};
exports.getBankCode = getBankCode;
const accountLookUp = async (account_number, bank_code) => {
    try {
        let data = {
            bank_code,
            account_number,
        };
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://sandbox-api-d.squadco.com/payout/account/lookup",
            headers: {
                Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            data: data,
        };
        const response = await axios_1.default.request(config);
        console.log("squadres", response.data);
        return response.data;
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
exports.accountLookUp = accountLookUp;
const payOut = async (user, bank_code, amount, account_number, account_name) => {
    try {
        console.log("ref", generateRefrenceCode());
        let data = {
            bank_code,
            amount,
            account_number,
            account_name,
            transaction_reference: generateRefrenceCode(),
            currency_id: "NGN",
            remark: `${user.firstName} ${user.lastName} payout to ${account_name}`,
        };
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://sandbox-api-d.squadco.com/payout/transfer",
            headers: {
                Authorization: `Bearer ${process.env.SQUAD_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            data: data,
        };
        const response = await axios_1.default.request(config);
        console.log("squadres", response.data);
        return response.data;
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
exports.payOut = payOut;
const getUserTransactions = async (user) => {
    try {
        const userTransaction = await Transaction_1.default.find({ userId: user });
        return userTransaction;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserTransactions = getUserTransactions;
const getUserSingleTransaction = async (user, transactionId) => {
    try {
        const userSingleTransaction = await Transaction_1.default.findOne({
            userId: user,
            _id: transactionId,
        });
        return userSingleTransaction;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserSingleTransaction = getUserSingleTransaction;
const getUserTransactionByStatus = async (user, status) => {
    try {
        const userTransaction = await Transaction_1.default.find({
            userId: user,
            status,
        });
        return userTransaction;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserTransactionByStatus = getUserTransactionByStatus;
const getUserTransactionByType = async (user, type) => {
    try {
        const userTransaction = await Transaction_1.default.find({ userId: user, type });
        return userTransaction;
    }
    catch (err) {
        throw err;
    }
};
exports.getUserTransactionByType = getUserTransactionByType;
const joinSavings = async (user, circleId) => {
    try {
        const savingsGroup = await Savings_group_1.default.findOne({
            savingsCircleId: circleId,
        });
        let currentCircle = await Savings_circle_1.default.findById(circleId);
        if (!savingsGroup) {
            throw { message: "No SavingsGroup found with this CircleID" };
        }
        savingsGroup.users.push(user._id);
        await savingsGroup.save();
        // create user savings record
        const userSavingsRecord = await User_savings_record_1.default.create({
            user: user._id,
            savingsId: savingsGroup.savingsId,
            savingsCircleId: savingsGroup.savingsCircleId,
            maturityAmount: currentCircle?.maturityAmount,
        });
        return userSavingsRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.joinSavings = joinSavings;
const userGetAllSubRegion = async () => {
    try {
        const allSubRegion = await (0, RegionalAdmin_1.getAllSubRegion)();
        return allSubRegion;
    }
    catch (err) {
        throw err;
    }
};
exports.userGetAllSubRegion = userGetAllSubRegion;
