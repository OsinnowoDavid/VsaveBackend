import User from "../model/User";
import VerificationToken from "../model/VerificationToken";
import KYC1 from "../model/KYC1";
import KYC from "../model/KYC";
import Transaction from "../model/Transaction";
import { IUser, IUserSavingsRecord } from "../../types";
import axios from "axios";
import BankCode from "../model/Bank_code";
import SavingsGroup from "../model/Savings_group";
import UserSavingsRecord from "../model/User_savings_record";
import SavingsCircle from "../model/Savings_circle";
import { getAllSubRegion } from "./RegionalAdmin";
import FixedSavings from "../model/FixedSavings";
import {
    getFiveMinutesAgo,
    generateRefrenceCode,
    generateSavingsRefrenceCode,
} from "../config/tools";
import savingsCircle from "../model/Savings_circle";
const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

export const createNewUser = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    gender: string,
    dateOfBirth: string,
    phoneNumber: string,
) => {
    try {
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
            gender,
            dateOfBirth,
            phoneNumber,
        });
        return newUser;
    } catch (err: any) {
        throw err;
    }
};

export const getUserById = async (id: string) => {
    try {
        const foundUser = await User.findById(id);
        return foundUser;
    } catch (err: any) {
        throw err;
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        const foundUser = await User.findOne({ email });
        return foundUser;
    } catch (err: any) {
        throw err;
    }
};

export const assignUserEmailVerificationToken = async (
    email: string,
    token: Number,
    expiresAt: Date,
) => {
    try {
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            throw {
                status: 404,
                message: "User not found",
            };
        }
        const assingToken = await VerificationToken.create({
            user: foundUser,
            email,
            token,
            expiresAt,
        });
        return assingToken;
    } catch (err: any) {
        throw err;
    }
};

export const getUserVerificationToken = async (
    email: String,
    token: String,
) => {
    try {
        const fiveMinsAgo = getFiveMinutesAgo();
        const foundToken = await VerificationToken.find({
            email,
            token,
            createdAt: { $gte: fiveMinsAgo },
        });

        return foundToken;
    } catch (err: any) {
        throw err;
    }
};

export const updateProfile = async (
    user: IUser,
    firstName: string,
    lastName: string,
    phoneNumber: string,
) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(user._id, {
            firstName,
            lastName,
            phoneNumber,
        });
        return updatedUser;
    } catch (err: any) {
        throw err;
    }
};

export const changePassword = async (user: IUser, newPassword: string) => {
    try {
        const updatedPassword = await User.findByIdAndUpdate(user._id, {
            password: newPassword,
        });
        return updatedPassword;
    } catch (err: any) {
        throw err;
    }
};

export const createKYCRecord = async (user: IUser) => {
    try {
        const newKYC = await KYC.create({
            user,
            kycStage: 1,
            status: "pending",
        });
        return newKYC;
    } catch (err: any) {
        throw err;
    }
};
export const kycStatusChange = async (
    user: IUser,
    status: string,
    stage: number,
) => {
    try {
        const updatedKYCRecord = await KYC.findOneAndUpdate(
            { user: user._id },
            { status, kycStage: stage },
            { new: true },
        );
        return updatedKYCRecord;
    } catch (err: any) {
        throw err;
    }
};
export const createKYC1Record = async (
    user: IUser,
    profession: string,
    accountNumber: number,
    bank: string,
    accountDetails: string,
    country: string,
    state: string,
    bvn: string,
    address: string,
    subRegion: string,
) => {
    try {
        const newKYC1 = await KYC1.create({
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
        const foundUser = (await User.findById(user._id)) as IUser;
        foundUser.subRegion = subRegion;
        await foundUser.save();
        return newKYC1;
    } catch (err: any) {
        throw err;
    }
};
export const updateKYC1Record = async (
    user: IUser,
    profession: string,
    bank: string,
    accountNumber: Number,
    accountDetails: string,
    country: string,
    state: string,
    address: string,
) => {
    try {
        const foundUser = await KYC1.findOneAndUpdate(
            { user: user._id },
            {
                profession,
                bank,
                accountNumber,
                accountDetails,
                country,
                state,
                address,
            },
        );
        return foundUser;
    } catch (err: any) {
        throw err;
    }
};
export const getAllBanksAndCode = async () => {
    try {
        const response = await axios.get(
            "https://api.flutterwave.com/v3/banks/NG",
            {
                headers: {
                    Authorization: `Bearer ${FLW_SECRET_KEY}`,
                },
            },
        );

        return response.data.data; // array of banks with codes
    } catch (err: any) {
        throw err;
    }
};

export const verifyBankaccount = async (
    accountNumber: string,
    bankCode: string,
) => {
    try {
        const response = await axios.post(
            "https://api.flutterwave.com/v3/accounts/resolve",
            {
                account_number: Number(accountNumber),
                account_bank: bankCode,
            },
            {
                headers: {
                    Authorization: `Bearer ${FLW_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            },
        );

        console.log("Account Details:", response.data);
        return response.data;
    } catch (err: any) {
        throw err;
    }
};

let getGenderCode = (gender: string) => {
    if (typeof gender !== "string") {
        throw new Error("Invalid input: expected a string");
    }

    const formatted = gender.trim().toLowerCase();

    if (formatted === "male") {
        return "1";
    } else if (formatted === "female") {
        return "2";
    } else {
        throw new Error("Invalid gender: must be 'Male' or 'Female'");
    }
};

let formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
};

export const createVirtualAccountForPayment = async (
    user: IUser,
    bvn: string,
    address: string,
) => {
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
        const response = await axios.request(config);
        return response.data;
        // includes virtual_account_number, bank details
    } catch (err: any) {
        // If the request fails, we log the response from the provider
        if (err.response) {
            console.error("Error Response Status:", err.response.status);
            console.error("Error Response Data:", err.response.data);
            throw err.response.data; // Return the exact response data from the provider
        } else if (err.request) {
            console.error("No Response:", err.request);
            throw { error: "No response from the server" };
        } else {
            console.error("Error:", err.message);
            throw { error: "Unexpected error occurred" };
        }
    }
};

export const createVirtualAccountIndex = async (
    user: string,
    account: string,
) => {
    try {
        const foundUser = await User.findByIdAndUpdate(user, {
            virtualAccountNumber: account,
        });
        return foundUser;
    } catch (err: any) {
        throw err;
    }
};

export const buyAirtime = async (phoneNumber: string, amount: number) => {
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
        const response = await axios.request(config);
        return response.data;
    } catch (err: any) {
        // If the request fails, we log the response from the provider
        if (err.response) {
            console.error("Error Response Status:", err.response.status);
            console.error("Error Response Data:", err.response.data);
            throw err.response.data; // Return the exact response data from the provider
        } else if (err.request) {
            console.error("No Response:", err.request);
            throw { error: "No response from the server" };
        } else {
            console.error("Error:", err.message);
            throw { error: "Unexpected error occurred" };
        }
    }
};

export const getDataPlan = async (network: string) => {
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
        const response = await axios.request(config);
        return response.data;
    } catch (err: any) {
        // If the request fails, we log the response from the provider
        if (err.response) {
            console.error("Error Response Status:", err.response.status);
            console.error("Error Response Data:", err.response.data);
            throw err.response.data; // Return the exact response data from the provider
        } else if (err.request) {
            console.error("No Response:", err.request);
            throw { error: "No response from the server" };
        } else {
            console.error("Error:", err.message);
            throw { error: "Unexpected error occurred" };
        }
    }
};

export const getUserKyc1Record = async (user: string) => {
    try {
        const foundKYC1 = await KYC1.findOne({ user });
        return foundKYC1;
    } catch (err: any) {
        throw err;
    }
};

export const buyData = async (
    phoneNumber: string,
    amount: string,
    planCode: string,
) => {
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
        const response = await axios.request(config);
        console.log("squadres", response.data);
        return response.data;
    } catch (err: any) {
        // If the request fails, we log the response from the provider
        if (err.response) {
            console.error("Error Response Status:", err.response.status);
            console.error("Error Response Data:", err.response.data);
            throw err.response.data; // Return the exact response data from the provider
        } else if (err.request) {
            console.error("No Response:", err.request);
            throw { error: "No response from the server" };
        } else {
            console.error("Error:", err.message);
            throw { error: "Unexpected error occurred" };
        }
    }
};

export const withdraw = async (user: IUser, amount: number) => {
    try {
        const foundUser = (await User.findById(user._id)) as IUser;
        let sum = Number(foundUser.availableBalance) - Number(amount);
        foundUser.availableBalance = sum;
        await foundUser.save();
        return foundUser;
    } catch (err: any) {
        throw err;
    }
};

export const deposit = async (user: IUser, amount: number) => {
    try {
        const foundUser = (await User.findById(user._id)) as IUser;
        let sum = Number(foundUser.availableBalance) + Number(amount);
        foundUser.availableBalance = sum;
        await foundUser.save();
        return foundUser;
    } catch (err: any) {
        throw err;
    }
};

export const createUserTransaction = async (
    user: string,
    type: string,
    transactionReference: string,
    amount: number,
    balanceBefore: number,
    balanceAfter: number,
    remark: string,
    status: string,
    date: Date,
    sender?: string,
    reciever?: string,
    feeCharged?: number,
) => {
    try {
        const foundUser = (await User.findById(user)) as IUser;
        const newTransaction = await Transaction.create({
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
    } catch (err: any) {
        throw err;
    }
};
export const checkTransferByRefrence = async (refrence: string) => {
    try {
        const foundTransaction = await Transaction.findOne({
            transactionReference: refrence,
        });
        return foundTransaction;
    } catch (err: any) {
        throw err;
    }
};
export const createUserDataTransaction = async (
    user: string,
    transactionReference: string,
    amount: string,
    balanceBefore: number,
    balanceAfter: number,
    reciever: string,
    network: string,
    bundle: any,
    feeCharged?: string,
) => {
    try {
        const foundUser = (await User.findById(user)) as IUser;
        const newTransaction = await Transaction.create({
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
    } catch (err: any) {
        throw err;
    }
};

export const createUserAirtimeTransaction = async (
    user: string,
    transactionReference: string,
    amount: string,
    balanceBefore: number,
    balanceAfter: number,
    reciever: string,
    network: string,
    feeCharged?: string,
) => {
    try {
        const foundUser = (await User.findById(user)) as IUser;
        const newTransaction = await Transaction.create({
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
    } catch (err: any) {
        throw err;
    }
};
export const getBankCode = async () => {
    try {
        const allBankCode = await BankCode.find();
        return allBankCode;
    } catch (err: any) {
        throw err;
    }
};
export const accountLookUp = async (
    account_number: string,
    bank_code: string,
) => {
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
        const response = await axios.request(config);
        console.log("squadres", response.data);
        return response.data;
    } catch (err: any) {
        // If the request fails, we log the response from the provider
        if (err.response) {
            console.error("Error Response Status:", err.response.status);
            console.error("Error Response Data:", err.response.data);
            throw err.response.data; // Return the exact response data from the provider
        } else if (err.request) {
            console.error("No Response:", err.request);
            throw { error: "No response from the server" };
        } else {
            console.error("Error:", err.message);
            throw { error: "Unexpected error occurred" };
        }
    }
};
export const payOut = async (
    user: IUser,
    bank_code: string,
    amount: string,
    account_number: string,
    account_name: string,
) => {
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
        const response = await axios.request(config);
        console.log("squadres", response.data);
        return response.data;
    } catch (err: any) {
        // If the request fails, we log the response from the provider
        if (err.response) {
            console.error("Error Response Status:", err.response.status);
            console.error("Error Response Data:", err.response.data);
            throw err.response.data; // Return the exact response data from the provider
        } else if (err.request) {
            console.error("No Response:", err.request);
            throw { error: "No response from the server" };
        } else {
            console.error("Error:", err.message);
            throw { error: "Unexpected error occurred" };
        }
    }
};

export const getUserTransactions = async (user: string) => {
    try {
        const userTransaction = await Transaction.find({ userId: user });
        return userTransaction;
    } catch (err: any) {
        throw err;
    }
};

export const getUserSingleTransaction = async (
    user: string,
    transactionId: string,
) => {
    try {
        const userSingleTransaction = await Transaction.findOne({
            userId: user,
            _id: transactionId,
        });
        return userSingleTransaction;
    } catch (err: any) {
        throw err;
    }
};
export const getUserTransactionByStatus = async (
    user: string,
    status: string,
) => {
    try {
        const userTransaction = await Transaction.find({
            userId: user,
            status,
        });
        return userTransaction;
    } catch (err: any) {
        throw err;
    }
};

export const getUserTransactionByType = async (user: string, type: string) => {
    try {
        const userTransaction = await Transaction.find({ userId: user, type });
        return userTransaction;
    } catch (err: any) {
        throw err;
    }
};

export const joinSavings = async (user: IUser, circleId: string) => {
    try {
        const savingsGroup = await SavingsGroup.findOne({
            savingsCircleId: circleId,
        });
        let currentCircle = await SavingsCircle.findById(circleId);
        if (!savingsGroup) {
            throw { message: "No SavingsGroup found with this CircleID" };
        }
        savingsGroup.users.push(user._id);
        await savingsGroup.save();
        // create user savings record
        const userSavingsRecord = await UserSavingsRecord.create({
            user: user._id,
            savingsId: savingsGroup.savingsId,
            savingsCircleId: savingsGroup.savingsCircleId,
            maturityAmount: currentCircle?.maturityAmount,
        });
        return userSavingsRecord;
    } catch (err: any) {
        throw err;
    }
};

export const userGetAllSubRegion = async () => {
    try {
        const allSubRegion = await getAllSubRegion();
        return allSubRegion;
    } catch (err: any) {
        throw err;
    }
};

export const createFixedSaving = async (
    user: string,
    amount: number,
    interestRate: string,
    paymentAmount: string,
    duration: number,
    startDate: Date,
    endDate: Date,
    status: string,
) => {
    try {
        const newFixedSavings = await FixedSavings.create({
            user,
            amount,
            currency: "NG",
            interestRate,
            paymentAmount,
            durationIndex: duration,
            duration: `${duration} Days`,
            startDate,
            endDate,
            status,
        });
        return newFixedSavings;
    } catch (err: any) {
        throw err;
    }
};

export const avaliableSavings = async (user: IUser) => {
    try {
        const avaliableSavings = await SavingsCircle.find({
            subRegion: user.subRegion,
            status: "ACTIVE",
        });

        return avaliableSavings;
    } catch (err: any) {
        throw err;
    }
};

export const userActiveSavingsRecord = async (user: IUser) => {
    try {
        const activeSavings = await UserSavingsRecord.find({
            user: user._id,
            status: "ACTIVE",
        });
        return activeSavings;
    } catch (err: any) {
        throw err;
    }
};

export const userSavingsRecords = async (user: IUser) => {
    try {
        const userSavings = await UserSavingsRecord.find({ user: user._id });
        return userSavings;
    } catch (err: any) {
        throw err;
    }
};

export const userWithdraw = async (
    user: string,
    amount: number,
    remark: string,
) => {
    try {
        const foundUser = (await User.findById(user)) as IUser;
        if (amount > foundUser.availableBalance) {
            return "Insufficient Funds";
        }
        let balanceBefore = Number(foundUser.availableBalance);
        let balanceAfter = Number(foundUser.availableBalance) - Number(amount);
        // withdraw money
        let balance = Number(foundUser.availableBalance) - Number(amount);
        foundUser.availableBalance = balance;
        await foundUser.save();
        //create transaction record
        const transaction = await createUserTransaction(
            user,
            "withdrawal",
            generateSavingsRefrenceCode(),
            amount,
            balanceBefore,
            balanceAfter,
            remark,
            "success",
            new Date(),
        );
        return transaction;
    } catch (err: any) {
        throw err;
    }
};
export const userDeposit = async (
    user: string,
    amount: number,
    transactionRef: string,
    date: Date,
    senderName: string,
    remark: string,
    fee_charged?: number,
) => {
    try {
        const foundUser = (await User.findById(user)) as IUser;
        let balanceBefore = Number(foundUser.availableBalance);
        let balanceAfter = Number(foundUser.availableBalance) - Number(amount);
        // withdraw money
        let balance = Number(foundUser.availableBalance) + Number(amount);
        foundUser.availableBalance = balance;
        await foundUser.save();
        //create transaction record
        const transaction = await createUserTransaction(
            user,
            "deposit",
            transactionRef,
            amount,
            balanceBefore,
            balanceAfter,
            remark,
            "success",
            date,
            senderName,
            "",
            fee_charged,
        );
        return transaction;
    } catch (err: any) {
        throw err;
    }
};
export const updateUserSavingsRecords = async (
    user: string,
    circleId: string,
    amount: number,
    period: number,
    status: string,
) => {
    try {
        const foundUser = (await UserSavingsRecord.findOne({
            user,
            savingsCircleId: circleId,
            status: "ACTIVE",
        })) as IUserSavingsRecord;
        let record: any = {
            period,
            periodIndex: Number(period),
            amount,
            status,
        };
        if (status === "paid") {
            foundUser.currentAmountSaved += amount;
        }
        foundUser.records.push(record);
        await foundUser.save();
        return foundUser;
    } catch (err: any) {
        throw err;
    }
};

export const getCircleById = async (circleId: string) => {
    try {
        const SavingsCircle = await savingsCircle.findById(circleId);
        return SavingsCircle;
    } catch (err: any) {
        throw err;
    }
};
