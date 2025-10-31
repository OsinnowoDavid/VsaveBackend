import { Request, Response } from "express";
import argon from "argon2";
import { assignAgentReferral } from "../services/Agent";
import {
    createNewUser,
    getUserByEmail,
    getUserById,
    assignUserEmailVerificationToken,
    getUserVerificationToken,
    createKYC1Record,
    createKYCRecord,
    kycStatusChange,
    getAllBanksAndCode,
    verifyBankaccount,
    createVirtualAccountForPayment,
    buyAirtime,
    getUserKyc1Record,
    getDataPlan,
    buyData,
    createVirtualAccountIndex,
    deposit,
    withdraw,
    createUserTransaction,
    createUserAirtimeTransaction,
    createUserDataTransaction,
    getBankCode,
    accountLookUp,
    payOut,
    getUserTransactions,
    getUserSingleTransaction,
    getUserTransactionByStatus,
    getUserTransactionByType,
    userGetAllSubRegion,
    joinSavings,
    avaliableSavings,
    userActiveSavingsRecord,
    userSavingsRecords,
} from "../services/User";
import { IUser, IVerificationToken, IKYC1 } from "../types";
import { signUserToken } from "../config/JWT";
import Transporter from "../config/nodemailer";
import axios from "axios";
import { format } from "path";
const QOREID_API_KEY = process.env.QOREID_SECRET_KEY as string;
const QOREID_BASE_URL = process.env.QOREID_BASE_URL as string;

export const registerUser = async (req: Request, res: Response) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            gender,
            dateOfBirth,
            phoneNumber,
            referralCode,
        } = req.body;
        let hashPassword = await argon.hash(password);
        // check if user is already in the database
        const user = (await getUserByEmail(email)) as IUser;
        // first check if it is a user that is in the database but didn't verify email
        if (user) {
            return res.json({
                status: "Failed",
                message: "User already exists Login Instead !",
                isEmailVerified: user.isEmailVerified,
            });
        }
        // create new user
        const newUser = (await createNewUser(
            firstName,
            lastName,
            email,
            hashPassword,
            gender,
            dateOfBirth,
            phoneNumber,
        )) as IUser;
        if (!newUser) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
        // send verification code to user email
        const tokenNumber = Math.floor(100000 + Math.random() * 900000);
        // generate exp time (expires in 5 min)
        const getNextFiveMinutes = () => {
            const now = new Date();
            const next = new Date(now.getTime() + 5 * 60 * 1000); // add 5 minutes
            return next;
        };
        const expTime = getNextFiveMinutes();
        const token = await assignUserEmailVerificationToken(
            email,
            tokenNumber,
            expTime,
        );
        if (!token) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
        //config mail option
        const mailOptions = {
            from: `<${process.env.User}>`, // sender
            to: email, // recipient
            subject: "Welcome to VSAVE 🎉",
            text: `Hello ${newUser.firstName}, welcome to our VSave! ,your trusted partner for smart saving and easy loans. To get started, please verify your email using the code below:
          CODE : ${tokenNumber}
          This code will expire in 5 minutes, so be sure to use it right away.
          We’re excited to have you on board!

          — The VSave Team.`,
        };

        // Send email
        let sentMale = await Transporter.sendMail(mailOptions);
        // assign referralCode
        await assignAgentReferral(referralCode, newUser);
        return res.json({
            status: "Success",
            message: `User created successfuly verify your email ,verification code has been sent to ${newUser.email}`,
            data: newUser,
        });
    } catch (err: any) {
        res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;
        const user = (await getUserByEmail(email)) as IUser;
        const verifyToken = (await getUserVerificationToken(
            email,
            code,
        )) as IVerificationToken;
        if (!verifyToken) {
            return res.json({
                Status: "Failed",
                message: "incorrect token",
            });
        }
        if (verifyToken.email) {
            user.isEmailVerified = true;
            await user.save();
            // register KYC
            await createKYCRecord(user);
            res.json({
                status: "Success",
                message: "email token verify successfuly",
            });
        }
        return res.json({
            status: "Failed",
            message: "something went wrong, try again later",
        });
    } catch (err: any) {
        res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const resendUserVerificationEmail = async (
    req: Request,
    res: Response,
) => {
    try {
        const { email } = req.body;
        const user = (await getUserByEmail(email)) as IUser;
        if (!user) {
            return res.json({
                status: "Failed",
                message: "User not found",
            });
        }
        const tokenNumber = Math.floor(100000 + Math.random() * 900000);
        const mailOptions = {
            from: `<${process.env.User}>`, // sender
            to: email, // recipient
            subject: "Welcome to VSAVE 🎉",
            text: ` Hello ${user.firstName} this is your VSave Verification code 
          ${tokenNumber} 
          code expires in 5 mins
      — The VSave Team.`,
        };
        // Send email
        await Transporter.sendMail(mailOptions);
        const getNextFiveMinutes = () => {
            const now = new Date();
            const next = new Date(now.getTime() + 5 * 60 * 1000); // add 5 minutes
            return next;
        };
        const expTime = getNextFiveMinutes();
        await assignUserEmailVerificationToken(
            user.email,
            tokenNumber,
            expTime,
        );
        return res.json({
            status: "Success",
            message: "Verification code has been sent to your email again !",
            isEmailVerified: user.isEmailVerified,
        });
    } catch (err: any) {
        res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
const getNextFiveMinutes = () => {
    const now = new Date();
    const next = new Date(now.getTime() + 5 * 60 * 1000); // add 5 minutes
    return next;
};
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = (await getUserByEmail(email)) as IUser;
        if (!user) {
            return res.json({
                status: "Failed",
                message: "User not found",
            });
        }
        // check is user verify Email
        if (!user.isEmailVerified) {
            const tokenNumber = Math.floor(100000 + Math.random() * 900000);
            const mailOptions = {
                from: `<${process.env.User}>`, // sender
                to: email, // recipient
                subject: "Welcome to VSAVE 🎉",
                text: ` Hello ${user.firstName} this is your VSave Verification code
          ${tokenNumber}
          code expires in 5 mins
      — The VSave Team.`,
            };
            // Send email
            await Transporter.sendMail(mailOptions);

            const expTime = getNextFiveMinutes();
            await assignUserEmailVerificationToken(
                user.email,
                tokenNumber,
                expTime,
            );
            return res.json({
                status: "Failed",
                message:
                    "Account is not Verified you just need to verify with your Email , a token has been sent to this Email check and verify",
                isEmailVerified: user.isEmailVerified,
            });
        }
        const verifyPassword = await argon.verify(user.password, password);
        if (!verifyPassword) {
            return res.json({
                status: "Failed",
                message: "incorrect password ",
            });
        }
        // Return success with JWT token
        return res.json({
            status: "Success",
            message: "login successfuly",
            token: signUserToken(user),
        });
    } catch (err: any) {
        res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const userProfile = async (req: Request, res: Response) => {
    try {
        let user = req.user as IUser;
        let kycRecord = await getUserKyc1Record(user._id.toString());
        if (!user) {
            return res.json({
                status: "Failed",
                message: "user not found",
            });
        }
        let data = {
            profile: user,
            kyc: kycRecord,
        };
        return res.json({
            Status: "Success",
            message: "welcome back",
            data,
        });
    } catch (err: any) {
        res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const registerKYC1 = async (req: Request, res: Response) => {
    try {
        const {
            profession,
            accountNumber,
            bank,
            accountDetails,
            country,
            state,
            bvn,
            address,
            subRegion,
        } = req.body;
        const user = req.user as IUser;
        // save KYC1
        const newKYC1 = await createKYC1Record(
            user,
            profession,
            accountNumber,
            bank,
            accountDetails,
            country,
            state,
            bvn,
            address,
            subRegion,
        );
        if (!newKYC1) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
        // change KYC status
        await kycStatusChange(user, "verified", 1);
        const virtualAccount = await createVirtualAccountForPayment(
            user,
            bvn,
            address,
        );
        if (virtualAccount.success === "false") {
            return res.json({
                status: "Failed",
                message: "something went wrong, account number not created",
                data: newKYC1,
            });
        }
        await createVirtualAccountIndex(
            user._id.toString(),
            virtualAccount.data.virtual_account_number,
        );
        return res.json({
            status: "Success",
            message: "KYC1 record created successfuly",
            data: newKYC1,
        });
    } catch (err: any) {
        console.log("error:", err.message);
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const getUserKyc1RecordController = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = req.user as IUser;
        const foundKYC = await getUserKyc1Record(user._id.toString());
        if (!foundKYC) {
            return res.json({
                status: "Failed",
                message: "No Record Found",
            });
        }
        return res.json({
            status: "Success",
            message: "Record Found",
            data: foundKYC,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const getDataPlanController = async (req: Request, res: Response) => {
    try {
        const { network } = req.params;
        const dataPlan = await getDataPlan(network);
        if (!dataPlan) {
            return res.json({
                status: "Failed",
                message: "something went wrong",
            });
        }
        return res.json({
            status: "Success",
            message: "Found Data Plan",
            data: dataPlan,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const buyAirtimeController = async (req: Request, res: Response) => {
    try {
        const { phoneNumber, amount } = req.body;
        const user = req.user as IUser;
        // check if avaliablebalance is greater than the purchased amount
        if (amount > user.availableBalance) {
            return res.json({
                status: "Failed",
                message: "Insufficient Fund Topup your account and try again",
            });
        }
        const airtime = await buyAirtime(phoneNumber, amount);
        if (!airtime) {
            return res.json({
                status: "Failed",
                message: "something went wrong",
            });
        }
        const { data } = airtime;
        let balanceBefore = user.availableBalance;
        let balanceAfter = user.availableBalance - Number(amount);
        // withdraw money from account
        await withdraw(user, amount);
        // save transaction
        const transaction = await createUserAirtimeTransaction(
            user._id.toString(),
            data.reference,
            data.amount,
            balanceBefore,
            balanceAfter,
            data.phone_number,
            data.network,
        );
        return res.json({
            status: "Success",
            message: "airtime purchase successful",
            data: transaction,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const buyDataController = async (req: Request, res: Response) => {
    try {
        const { phoneNumber, amount, planCode } = req.body;
        const user = req.user as IUser;
        // check if avaliablebalance is greater than the purchased amount
        if (amount > user.availableBalance) {
            return res.json({
                status: "Failed",
                message: "Insufficient Fund Topup your account and try again",
            });
        }
        console.log("got here");
        const dataPurchase = await buyData(phoneNumber, amount, planCode);
        if (!dataPurchase) {
            return res.json({
                status: "Failed",
                message: "something went wrong",
            });
        }
        console.log("user:", user);
        const { data } = dataPurchase;
        let balanceBefore = user.availableBalance;
        let balanceAfter = user.availableBalance - Number(amount);
        // withdraw money from account
        await withdraw(user, amount);
        // save transaction record
        const transaction = await createUserDataTransaction(
            user._id.toString(),
            data.reference,
            data.amount,
            balanceBefore,
            balanceAfter,
            data.phone_number,
            data.network,
            data.meta_json.bundle,
        );
        return res.json({
            status: "Success",
            message: "data purchased",
            data: transaction,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const getBankCodeController = async (req: Request, res: Response) => {
    try {
        const allBankCode = await getBankCode();
        return res.json({
            status: "Success",
            message: "found bankcode",
            data: allBankCode,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const accountLookUpController = async (req: Request, res: Response) => {
    try {
        const { accountNumber, bankCode } = req.body;
        const foundAccount = await accountLookUp(accountNumber, bankCode);
        return res.json({
            status: "Success",
            message: "found account",
            data: foundAccount.data,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const payOutController = async (req: Request, res: Response) => {
    try {
        const { bankCode, accountNumber, accountName, amount } = req.body;
        const user = req.user as IUser;
        //check if user avaliableBalance is greater than the amount
        if (amount > user.availableBalance) {
            return res.json({
                status: "Failed",
                message: "insufficient fund",
            });
        }
        const payment = await payOut(
            user,
            bankCode,
            amount,
            accountNumber,
            accountName,
        );
        let balanceBefore = user.availableBalance;
        let balanceAfter = user.availableBalance - Number(amount);
        let remark = `${user.firstName} ${user.lastName} payout to ${accountName}`;
        //withdraw money fro  user availiable
        await withdraw(user, amount);
        //save transaction record
        const transaction = await createUserTransaction(
            user._id.toString(),
            "withdrawal",
            payment.data.transaction_reference,
            amount,
            balanceBefore,
            balanceAfter,
            remark,
            "success",
            new Date(),
            `${user.firstName} ${user.lastName}`,
            accountName,
        );
        return res.json({
            status: "Success",
            message: "transaction completed",
            data: transaction,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const getUserTransactionsController = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = req.user as IUser;
        const foundTransaction = await getUserTransactions(user._id.toString());
        return res.json({
            status: "Success",
            message: "Found Transaction",
            data: foundTransaction,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const getUserSingleTransactionController = async (
    req: Request,
    res: Response,
) => {
    try {
        const { id } = req.params;
        const user = req.user as IUser;
        const foundTransaction = await getUserSingleTransaction(
            user._id.toString(),
            id,
        );
        return res.json({
            status: "Success",
            message: "Found Transaction",
            data: foundTransaction,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const getUserTransactionByStatusController = async (
    req: Request,
    res: Response,
) => {
    try {
        const { status } = req.params;
        const user = req.user as IUser;
        const foundTransaction = await getUserTransactionByStatus(
            user._id.toString(),
            status,
        );
        return res.json({
            status: "Success",
            message: "Found Transaction",
            data: foundTransaction,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const getUserTransactionByTypeController = async (
    req: Request,
    res: Response,
) => {
    try {
        const { type } = req.params;
        const user = req.user as IUser;
        const foundTransaction = await getUserTransactionByType(
            user._id.toString(),
            type,
        );
        return res.json({
            status: "Success",
            message: "Found Transaction",
            data: foundTransaction,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const userGetAllSubRegionController = async (
    req: Request,
    res: Response,
) => {
    try {
        const subRegions = await userGetAllSubRegion();
        return res.json({
            status: "Success",
            message: "found all subregion",
            data: subRegions,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const joinSavingsController = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;
        const { circleId } = req.body;
        const jointSavings = await joinSavings(user, circleId);
        return res.json({
            status: "Success",
            message: "joined savings group successfuly",
            data: jointSavings,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const getAvaliableSavingsController = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = req.user as IUser;
        const allAvaliableSavings = await avaliableSavings(user);
        return res.json({
            status: "Success",
            message: "found savings",
            data: allAvaliableSavings,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const getUserActiveSavingsController = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = req.user as IUser;
        const activeSavings = await userActiveSavingsRecord(user);
        return res.json({
            status: "Success",
            message: "found savings",
            data: activeSavings,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const getUserSavingsRecordsController = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = req.user as IUser;
        const foundRecords = await userSavingsRecords(user);
        return res.json({
            status: "Success",
            message: "found savings",
            data: foundRecords,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
