import User from "../model/User";
import VerificationToken from "../model/VerificationToken";
import KYC1 from "../model/KYC1";
import KYC from "../model/KYC";
import { IUser } from "../types";
import axios from "axios";
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
        const foundToken = await VerificationToken.findOne({ email, token });
        return foundToken;
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
        const foundUser = await User.findById(user._id);
        foundUser;
        return newKYC1;
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

export const createVirtualAccountForPayment = async (
    user: IUser,
    bvn: string,
    address: string,
) => {
    try {
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
        let gender = getGenderCode(user.gender);
        let formatDate = (date: Date) => {
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
        const response = await axios.request(config);
        return response.data;
    } catch (err: any) {
        throw err;
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
        throw err;
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
        return response.data;
    } catch (err: any) {
        throw err;
    }
};
