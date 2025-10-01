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
  password: string
) => {
  try {
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
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
  expiresAt: Date
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
  token: String
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
  stage: number
) => {
  try {
    const updatedKYCRecord = await KYC.findOneAndUpdate(
      { user },
      { status, kycStage: stage },
      { new: true }
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
  bvn: string
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
      }
    );

    return response.data.data; // array of banks with codes
  } catch (err: any) {
    throw err;
  }
};

export const verifyBankaccount = async (
  accountNumber: string,
  bankCode: string
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
      }
    );

    console.log("Account Details:", response.data);
    return response.data;
  } catch (err: any) {
    throw err;
  }
};

export const createVirtualAccountForPayment = async (
  user: IUser,
  bvn: string
) => {
  try {
    console.log("user:", user);
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
    let dob = formatDate(user.dateOfBirth);
    let gender = getGenderCode(user.gender);
    let data = JSON.stringify({
      customer_identifier: user._id,
      first_name: user.firstName,
      last_name: user.lastName,
      mobile_num: user.phoneNumber,
      email: user.email,
      bvn,
      dob,
      address: user.address,
      gender,
      beneficiary_account: "9006809223",
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api-d.squadco.com/virtual-account",
      headers: {
        Authorization: "Bearer sk_5709ece1ad1217f663a4b66f60b523d1072bf323",
        "Content-Type": "application/json",
      },
      data: data,
    };
    console.log("payload:", data);
    const response = await axios.request(config);
    return response.data;
    // includes virtual_account_number, bank details
  } catch (err: any) {
    console.log("error:", err.message, "data:", err.data);
    throw err;
  }
};
