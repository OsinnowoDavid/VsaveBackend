import { Request, Response } from "express";
import argon from "argon2";
import { assignAgentReferral } from "../services/Agent";
import {
    createNewUser,
    getUserByEmail,
    getUserById,
    assignUserEmailVerificationToken,
    getUserVerificationToken,
    updateProfile,
    changePassword,
    createKYC1Record,
    createKYCRecord,
    kycStatusChange,
    updateKYC1Record,
    getAllBanksAndCode,
    verifyBankaccount,
    createVirtualAccountForPayment,
    buyAirtime,
    getUserKyc1Record,
    getDataPlan,
    buyData,
    createVirtualAccountIndex,
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
    // userActiveSavingsRecord,
    // userSavingsRecords,
    getCircleById,
    createFixedSaving,
    userWithdraw,
    userDeposit,
    createTransactionPin,
    validateTransactionPin,
} from "../services/User";
import { IUser, IVerificationToken, IKYC1 } from "../../types";
import {
    getUserActiveFixedSavings,
    getUserCompletedFixedSavings,
    getUserFixedSavings,
} from "../services/Savings";
import { signUserToken } from "../config/JWT";
import SGMail from "@sendgrid/mail";
import {
    createUserPersonalSavings,
    joinSavings,
    getAllActiveSavingsCircle,
    checkForCircleById,
    getUserActiveSavingsRecord,
    userSavingsRecords,
} from "../services/Savings";
import {
    calculateEndDate,
    calculateMaturityAmount,
    calculateProportionalInterest,
    generateSavingsRefrenceCode,
    getCurrentDateWithClosestHour,
} from "../config/tools";
import AdminSavingsConfig from "../model/Admin_config";
const QOREID_API_KEY = process.env.QOREID_SECRET_KEY as string;
const QOREID_BASE_URL = process.env.QOREID_BASE_URL as string;

SGMail.setApiKey(process.env.SENDGRID_API_KEY);
const getNextFiveMinutes = () => {
    const now = new Date();
    const next = new Date(now.getTime() + 5 * 60 * 1000); // add 5 minutes
    return next;
};

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
        const newUser = await createNewUser(
            firstName,
            lastName,
            email,
            hashPassword,
            gender,
            dateOfBirth,
            phoneNumber,
        );

        if (!newUser) {
            return res.status(500).json({
                status: "Failed",
                message: "Failed to create user, please try again later",
            });
        }

        //send verification code to user email
        const tokenNumber = Math.floor(100000 + Math.random() * 900000);

        const expTime = getNextFiveMinutes();

        let token;
        token = await assignUserEmailVerificationToken(
            email,
            tokenNumber,
            expTime,
        );
        if (!token) {
            return res.status(500).json({
                status: "Failed",
                message: "Failed to generate verification token",
            });
        }
        //  config mail option
        const msg = {
            to: newUser.email,
            from: `David <danyboy99official@gmail.com>`,
            subject: "Welcome to VSAVE 🎉",
            html: `Hello ${newUser.firstName}, welcome to our VSave! ,your trusted partner for smart saving and easy loans. To get started, please verify your email using the code below:
           CODE : ${tokenNumber}
           This code will expire in 5 minutes, so be sure to use it right away.
           We're excited to have you on board!

          — The VSave Team.`,
        };

        const sentMail = await SGMail.send(msg);
        // console.log(
        //     " controller pass and user:",
        //     process.env.User,
        //     process.env.Pass,
        // );
        // const mailOptions = {
        //     from: `<${process.env.User}>`, // sender
        //     to: email, // recipient
        //     subject: "Welcome to VSAVE 🎉",
        //     text: `Hello ${newUser.firstName}, welcome to our VSave! ,your trusted partner for smart saving and easy loans. To get started, please verify your email using the code below:
        //   CODE : ${tokenNumber}
        //   This code will expire in 5 minutes, so be sure to use it right away.
        //   We're excited to have you on board!

        //   — The VSave Team.`,
        // };
        // console.log("got to the  mail option :", mailOptions);
        // // Send email
        // try {
        //     console.log("transporter:", JSON.stringify(Transporter));
        //     let sentMale = await Transporter.sendMail(mailOptions);
        //     console.log("sentMale:", sentMale);
        // } catch (err: any) {
        //     return res.json({
        //         status: "Failed",
        //         message: err.message,
        //         err,
        //     });
        // }
        // console.log(
        //     "transporter response:",
        //     process.env.User,
        //     process.env.Pass,
        // );
        //  assign referralCode
        await assignAgentReferral(referralCode, newUser);
        return res.json({
            status: "Success",
            message: `User created successfully. Verify your email - verification code has been sent to ${newUser.email} (also check your spam meesage for the code )`,
            data: newUser,
        });
    } catch (err: any) {
        console.error("Unexpected error in registerUser:", err);

        // Don't expose internal error details in production
        const errorMessage =
            process.env.NODE_ENV === "production"
                ? "An unexpected error occurred. Please try again later."
                : err.message;

        return res.status(500).json({
            status: "Failed",
            message: errorMessage,
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
        )) as any;
        for (const token of verifyToken) {
            if (token.token === code.toString()) {
                user.isEmailVerified = true;
                await user.save();
                // register KYC
                await createKYCRecord(user);
                return res.json({
                    status: "Success",
                    message: "email token verify successfuly",
                });
            }
        }
        return res.json({
            status: "Failed",
            message: "Incorrect code ",
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
        //  config mail option
        const msg = {
            to: user.email,
            from: `David <danyboy99official@gmail.com>`,
            subject: "Welcome to VSAVE 🎉",
            html: `Hello ${user.firstName}, welcome to our VSave! ,your trusted partner for smart saving and easy loans. To get started, please verify your email using the code below:
           CODE : ${tokenNumber}
           This code will expire in 5 minutes, so be sure to use it right away.
           We're excited to have you on board!

          — The VSave Team.`,
        };

        const sentMail = await SGMail.send(msg);
        const expTime = getNextFiveMinutes();
        await assignUserEmailVerificationToken(
            user.email,
            tokenNumber,
            expTime,
        );
        return res.json({
            status: "Success",
            message:
                "Verification code has been sent to your email again (also check your spam meesage for the code ) ! ",
            isEmailVerified: user.isEmailVerified,
        });
    } catch (err: any) {
        res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = (await getUserByEmail(email.toLowerCase())) as IUser;
        if (!user) {
            return res.json({
                status: "Failed",
                message: "User not found",
            });
        }
        // check is user verify Email
        if (!user.isEmailVerified) {
            const tokenNumber = Math.floor(100000 + Math.random() * 900000);
            //  config mail option
            const msg = {
                to: user.email,
                from: `David <danyboy99official@gmail.com>`,
                subject: "Welcome to VSAVE 🎉",
                html: `Hello ${user.firstName}, welcome to our VSave! ,your trusted partner for smart saving and easy loans. To get started, please verify your email using the code below:
           CODE : ${tokenNumber}
           This code will expire in 5 minutes, so be sure to use it right away.
           We're excited to have you on board!

          — The VSave Team.`,
            };

            const sentMail = await SGMail.send(msg);

            const expTime = getNextFiveMinutes();
            await assignUserEmailVerificationToken(
                user.email,
                tokenNumber,
                expTime,
            );
            return res.json({
                status: "Failed",
                message:
                    "Account is not Verified you just need to verify with your Email , a token has been sent to this Email check and verify (also check your spam meesage for the code )",
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

export const updateProfileController = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, phoneNumber } = req.body;
        const user = req.user as IUser;
        const updatedProfile = await updateProfile(
            user,
            firstName,
            lastName,
            phoneNumber,
        );
        return res.json({
            status: "Success",
            message: "profile updated successfuly",
            data: updatedProfile,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const changePasswordController = async (req: Request, res: Response) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const user = req.body as IUser;
        const verifyPassword = await argon.verify(user.password, oldPassword);
        if (!verifyPassword) {
            return res.json({
                status: "Failed",
                message: "incorrect old Password",
            });
        }
        let hashPassword = await argon.hash(newPassword);
        const changedPassword = await changePassword(user, hashPassword);
        return res.json({
            status: "Success",
            message: "password changed successfuly",
            data: changedPassword,
        });
    } catch (err: any) {
        return res.json({
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
export const updateKYC1RecordController = async (
    req: Request,
    res: Response,
) => {
    try {
        const {
            profession,
            bank,
            accountNumber,
            accountDetails,
            country,
            state,
            address,
        } = req.body;
        const user = req.user as IUser;
        const updatedKYC1 = await updateKYC1Record(
            user,
            profession,
            bank,
            accountNumber,
            accountDetails,
            country,
            state,
            address,
        );
        return res.json({
            status: "Success",
            message: "KYC updated successfuly",
            data: updatedKYC1,
        });
    } catch (err: any) {
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

export const createTransactionPinController = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = req.user as IUser;
        const { pin } = req.body;
        const newRecord = await createTransactionPin(user._id.toString(), pin);
        return res.json({
            status: "Success",
            message: "transaction pin updated successfuly",
            data: newRecord,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const updateTransactionPinController = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = req.user as IUser;
        const { oldPin, newPin } = req.body;
        if (oldPin !== user.pin) {
            return res.json({
                status: "Failed",
                message: "Incorrect old pin",
            });
        }
        const updateRecord = await createTransactionPin(
            user._id.toString(),
            newPin,
        );
        return res.json({
            status: "Success",
            message: "Pin updated successfuly",
            data: updateRecord,
        });
    } catch (err: any) {
        throw err;
    }
};
export const validateTransactionPinController = async (
    req: Request,
    res: Response,
) => {
    try {
        const { pin } = req.body;
        const user = req.user as IUser;
        const isValid = await validateTransactionPin(user._id.toString(), pin);
        if (isValid) {
            req.validateTransactionPin.pin = pin;
            req.validateTransactionPin.status = true;
            return res.json({
                status: "Success",
                message: "Transaction pin Validation successful",
            });
        }
        req.validateTransactionPin.pin = 0;
        req.validateTransactionPin.status = false;
        return res.json({
            status: "Failed",
            message: "Incorrect pin",
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
        // check if user validate transaction pin
        if (!req.validateTransactionPin.status) {
            return res.json({
                status: "Failed",
                message: "Validate transaction pin to procced with transaction",
            });
        }
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
        // check if user validate transaction pin
        if (!req.validateTransactionPin.status) {
            return res.json({
                status: "Failed",
                message: "Validate transaction pin to procced with transaction",
            });
        }
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
        // check if user validate transaction pin
        if (!req.validateTransactionPin.status) {
            return res.json({
                status: "Failed",
                message: "Validate transaction pin to procced with transaction",
            });
        }
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
function getTomorrowDate(): Date {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
}
export const joinSavingsController = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;
        const { circleId, autoRestartEnabled } = req.body;
        const foundSavingsCircle = await getCircleById(circleId);
        let startDate = getTomorrowDate();
        let endDate = calculateEndDate(
            foundSavingsCircle.frequency,
            startDate,
            foundSavingsCircle.duration,
        );
        const jointSavings = await joinSavings(
            user,
            circleId,
            autoRestartEnabled,
            startDate,
            endDate,
            "PAUSED",
        );
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
export const createPersonalSavingsCircleController = async (
    req: Request,
    res: Response,
) => {
    try {
        const {
            savingsTitle,
            frequency,
            duration,
            deductionPeriod,
            savingsAmount,
            startDate,
            autoRestartEnabled,
        } = req.body;
        let user = req.user as IUser;
        const { firstTimeAdminFee } = await AdminSavingsConfig.getSettings();
        let endDate = calculateEndDate(frequency, startDate, duration);
        let maturityAmount = calculateMaturityAmount(
            frequency,
            duration,
            savingsAmount,
            Number(firstTimeAdminFee),
        );
        console.log("maturity amount:", maturityAmount);
        const newSavingsCircle = await createUserPersonalSavings(
            user,
            savingsTitle,
            frequency,
            duration,
            deductionPeriod,
            savingsAmount,
            maturityAmount,
            startDate,
            endDate,
            autoRestartEnabled,
        );
        return res.json({
            status: "Success",
            message: "savings created successfuly",
            data: newSavingsCircle,
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
        const allAvaliableSavings = await getAllActiveSavingsCircle(
            user.subRegion.toString(),
        );
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

export const getUserActiveSavingsRecordController = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = req.user as IUser;
        const record = await getUserActiveSavingsRecord(user);
        let result = [] as any;
        for (const rec of record) {
            let savingsCircle = await checkForCircleById(
                rec.savingsCircleId.toString(),
            );
            let miniResult = [] as any;
            miniResult.push(savingsCircle);
            miniResult.push(rec);
            result.push(miniResult);
        }

        return res.json({
            status: "Success",
            message: "found savings plan",
            data: result,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const getAllUserSavingsRecordController = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = req.user as IUser;
        const record = await userSavingsRecords(user);
        let result = [] as any;
        for (const rec of record) {
            let savingsCircle = await checkForCircleById(
                rec.savingsCircleId.toString(),
            );
            let miniResult = [] as any;
            miniResult.push(savingsCircle);
            miniResult.push(rec);
            result.push(miniResult);
        }

        return res.json({
            status: "Success",
            message: "found savings plan",
            data: result,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const getSavingsCircleByIdController = async (
    req: Request,
    res: Response,
) => {
    try {
        const { id } = req.params;
        const foundCircle = await checkForCircleById(id.toString());
        if (!foundCircle) {
            return res.json({
                status: "Failed",
                message: "no savings circle found",
            });
        }
        return res.json({
            status: "Success",
            message: "found savings ",
            data: foundCircle,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
function getFixedEndDate(startDate: Date, durationInDays: number): Date {
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const day = startDate.getDate() + durationInDays;
    const hour = startDate.getHours();
    return new Date(year, month, day, hour, 0, 0, 0);
}
export const createFixedSavingController = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = req.user as IUser;
        const { amount, title, interestPayoutType, duration } = req.body;
        const { fixedSavingsAnualInterest } =
            await AdminSavingsConfig.getSettings();

        // withdaw money from user account
        let remark = `deposit of ${amount} to your fixed savings account`;
        const withdrawal = await userWithdraw(
            user._id.toString(),
            amount,
            remark,
        );
        if (withdrawal === "Insufficient Funds") {
            return res.json({
                status: "Failed",
                message: "Insufficient funds to initiate fixed savings",
            });
        }
        const { interestAmount, interestPercentage } =
            calculateProportionalInterest(
                amount,
                Number(fixedSavingsAnualInterest),
                duration,
            );
        let sender = `${user.firstName} ${user.lastName}`;
        let depositRemark = `interest deposit on fixed savings`;
        let startDate = getCurrentDateWithClosestHour();
        let endDate = getFixedEndDate(startDate, Number(duration));

        if (interestPayoutType === "UPFRONT") {
            const deposit = await userDeposit(
                user._id.toString(),
                interestAmount,
                generateSavingsRefrenceCode(),
                new Date(),
                sender,
                depositRemark,
            );
            const newSavingsRecord = await createFixedSaving(
                user._id.toString(),
                title,
                amount,
                interestPercentage.toString(),
                amount,
                Number(duration),
                startDate,
                endDate,
                "active",
                "UPFRONT",
                interestAmount,
            );
            return res.json({
                status: "Success",
                message: "fixed savings created successfully",
                data: newSavingsRecord,
            });
        }
        let payout = amount + interestAmount;
        const newSavingsRecord = await createFixedSaving(
            user._id.toString(),
            title,
            amount,
            interestPercentage.toString(),
            payout,
            Number(duration),
            startDate,
            endDate,
            "active",
            "MATURITY",
            interestAmount,
        );
        return res.json({
            status: "Success",
            message: "fixed savings created successfully",
            data: newSavingsRecord,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
export const getActiveFixedSavingsController = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = req.user as IUser;
        const allRecord = await getUserActiveFixedSavings(user);
        return res.json({
            status: "Success",
            message: "all record found",
            data: allRecord,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const getCompletedFixedSavingsController = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = req.user as IUser;
        const allRecord = await getUserCompletedFixedSavings(user);
        return res.json({
            status: "Success",
            message: "all record found",
            data: allRecord,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const getAllFixedSavingsController = async (
    req: Request,
    res: Response,
) => {
    try {
        const user = req.user as IUser;
        const allRecord = await getUserFixedSavings(user);
        return res.json({
            status: "Success",
            message: "all record found",
            data: allRecord,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
