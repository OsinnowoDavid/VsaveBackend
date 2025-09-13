import User from "../model/User";
import VerificationToken from "../model/VerificationToken";
import KYC1 from "../model/KYC1";
import KYC from "../model/KYC";
import { IUser } from "../types";

export const createNewUser = async (
  fullname: string,
  email: string,
  password: string
) => {
  try {
    const newUser = await User.create({
      fullname,
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
  accountDetails: string,
  country: string,
  state: string,
  nin: string
) => {
  try {
    const newKYC1 = await KYC1.create({
      user,
      profession,
      accountNumber,
      accountDetails,
      country,
      state,
      nin,
    });
    const foundUser = await User.findById(user._id);
    foundUser;
    return newKYC1;
  } catch (err: any) {
    throw err;
  }
};
