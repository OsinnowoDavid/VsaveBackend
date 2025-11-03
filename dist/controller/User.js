"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSavingsRecordsController = exports.getUserActiveSavingsController = exports.getAvaliableSavingsController = exports.joinSavingsController = exports.userGetAllSubRegionController = exports.getUserTransactionByTypeController = exports.getUserTransactionByStatusController = exports.getUserSingleTransactionController = exports.getUserTransactionsController = exports.payOutController = exports.accountLookUpController = exports.getBankCodeController = exports.buyDataController = exports.buyAirtimeController = exports.getDataPlanController = exports.getUserKyc1RecordController = exports.registerKYC1 = exports.userProfile = exports.loginUser = exports.resendUserVerificationEmail = exports.verifyEmail = exports.registerUser = void 0;
const argon2_1 = __importDefault(require("argon2"));
const Agent_1 = require("../services/Agent");
const User_1 = require("../services/User");
const JWT_1 = require("../config/JWT");
const nodemailer_1 = __importDefault(require("../config/nodemailer"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const QOREID_API_KEY = process.env.QOREID_SECRET_KEY;
const QOREID_BASE_URL = process.env.QOREID_BASE_URL;
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, gender, dateOfBirth, phoneNumber, referralCode, } = req.body;
        let hashPassword = await argon2_1.default.hash(password);
        const newUser = await (0, User_1.createNewUser)(firstName, lastName, email, hashPassword, gender, dateOfBirth, phoneNumber);
        if (!newUser) {
            return res.status(500).json({
                status: "Failed",
                message: "Failed to create user, please try again later",
            });
        }
        //send verification code to user email
        const tokenNumber = Math.floor(100000 + Math.random() * 900000);
        // generate exp time (expires in 5 min)
        const getNextFiveMinutes = () => {
            const now = new Date();
            const next = new Date(now.getTime() + 5 * 60 * 1000); // add 5 minutes
            return next;
        };
        const expTime = getNextFiveMinutes();
        let token;
        token = await (0, User_1.assignUserEmailVerificationToken)(email, tokenNumber, expTime);
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
        const sentMail = await mail_1.default.send(msg);
        console.log("sentMail:", sentMail);
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
        await (0, Agent_1.assignAgentReferral)(referralCode, newUser);
        return res.json({
            status: "Success",
            message: `User created successfully. Verify your email - verification code has been sent to ${newUser.email}`,
            data: newUser,
        });
    }
    catch (err) {
        console.error("Unexpected error in registerUser:", err);
        // Don't expose internal error details in production
        const errorMessage = process.env.NODE_ENV === "production"
            ? "An unexpected error occurred. Please try again later."
            : err.message;
        return res.status(500).json({
            status: "Failed",
            message: errorMessage,
        });
    }
};
exports.registerUser = registerUser;
const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = (await (0, User_1.getUserByEmail)(email));
        const verifyToken = (await (0, User_1.getUserVerificationToken)(email, code));
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
            await (0, User_1.createKYCRecord)(user);
            res.json({
                status: "Success",
                message: "email token verify successfuly",
            });
        }
        return res.json({
            status: "Failed",
            message: "something went wrong, try again later",
        });
    }
    catch (err) {
        res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.verifyEmail = verifyEmail;
const resendUserVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = (await (0, User_1.getUserByEmail)(email));
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
        await nodemailer_1.default.sendMail(mailOptions);
        const getNextFiveMinutes = () => {
            const now = new Date();
            const next = new Date(now.getTime() + 5 * 60 * 1000); // add 5 minutes
            return next;
        };
        const expTime = getNextFiveMinutes();
        await (0, User_1.assignUserEmailVerificationToken)(user.email, tokenNumber, expTime);
        return res.json({
            status: "Success",
            message: "Verification code has been sent to your email again !",
            isEmailVerified: user.isEmailVerified,
        });
    }
    catch (err) {
        res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.resendUserVerificationEmail = resendUserVerificationEmail;
const getNextFiveMinutes = () => {
    const now = new Date();
    const next = new Date(now.getTime() + 5 * 60 * 1000); // add 5 minutes
    return next;
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = (await (0, User_1.getUserByEmail)(email));
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
            await nodemailer_1.default.sendMail(mailOptions);
            const expTime = getNextFiveMinutes();
            await (0, User_1.assignUserEmailVerificationToken)(user.email, tokenNumber, expTime);
            return res.json({
                status: "Failed",
                message: "Account is not Verified you just need to verify with your Email , a token has been sent to this Email check and verify",
                isEmailVerified: user.isEmailVerified,
            });
        }
        const verifyPassword = await argon2_1.default.verify(user.password, password);
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
            token: (0, JWT_1.signUserToken)(user),
        });
    }
    catch (err) {
        res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.loginUser = loginUser;
const userProfile = async (req, res) => {
    try {
        let user = req.user;
        let kycRecord = await (0, User_1.getUserKyc1Record)(user._id.toString());
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
    }
    catch (err) {
        res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.userProfile = userProfile;
const registerKYC1 = async (req, res) => {
    try {
        const { profession, accountNumber, bank, accountDetails, country, state, bvn, address, subRegion, } = req.body;
        const user = req.user;
        // save KYC1
        const newKYC1 = await (0, User_1.createKYC1Record)(user, profession, accountNumber, bank, accountDetails, country, state, bvn, address, subRegion);
        if (!newKYC1) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
        // change KYC status
        await (0, User_1.kycStatusChange)(user, "verified", 1);
        const virtualAccount = await (0, User_1.createVirtualAccountForPayment)(user, bvn, address);
        if (virtualAccount.success === "false") {
            return res.json({
                status: "Failed",
                message: "something went wrong, account number not created",
                data: newKYC1,
            });
        }
        await (0, User_1.createVirtualAccountIndex)(user._id.toString(), virtualAccount.data.virtual_account_number);
        return res.json({
            status: "Success",
            message: "KYC1 record created successfuly",
            data: newKYC1,
        });
    }
    catch (err) {
        console.log("error:", err.message);
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.registerKYC1 = registerKYC1;
const getUserKyc1RecordController = async (req, res) => {
    try {
        const user = req.user;
        const foundKYC = await (0, User_1.getUserKyc1Record)(user._id.toString());
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
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getUserKyc1RecordController = getUserKyc1RecordController;
const getDataPlanController = async (req, res) => {
    try {
        const { network } = req.params;
        const dataPlan = await (0, User_1.getDataPlan)(network);
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
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getDataPlanController = getDataPlanController;
const buyAirtimeController = async (req, res) => {
    try {
        const { phoneNumber, amount } = req.body;
        const user = req.user;
        // check if avaliablebalance is greater than the purchased amount
        if (amount > user.availableBalance) {
            return res.json({
                status: "Failed",
                message: "Insufficient Fund Topup your account and try again",
            });
        }
        const airtime = await (0, User_1.buyAirtime)(phoneNumber, amount);
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
        await (0, User_1.withdraw)(user, amount);
        // save transaction
        const transaction = await (0, User_1.createUserAirtimeTransaction)(user._id.toString(), data.reference, data.amount, balanceBefore, balanceAfter, data.phone_number, data.network);
        return res.json({
            status: "Success",
            message: "airtime purchase successful",
            data: transaction,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.buyAirtimeController = buyAirtimeController;
const buyDataController = async (req, res) => {
    try {
        const { phoneNumber, amount, planCode } = req.body;
        const user = req.user;
        // check if avaliablebalance is greater than the purchased amount
        if (amount > user.availableBalance) {
            return res.json({
                status: "Failed",
                message: "Insufficient Fund Topup your account and try again",
            });
        }
        console.log("got here");
        const dataPurchase = await (0, User_1.buyData)(phoneNumber, amount, planCode);
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
        await (0, User_1.withdraw)(user, amount);
        // save transaction record
        const transaction = await (0, User_1.createUserDataTransaction)(user._id.toString(), data.reference, data.amount, balanceBefore, balanceAfter, data.phone_number, data.network, data.meta_json.bundle);
        return res.json({
            status: "Success",
            message: "data purchased",
            data: transaction,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.buyDataController = buyDataController;
const getBankCodeController = async (req, res) => {
    try {
        const allBankCode = await (0, User_1.getBankCode)();
        return res.json({
            status: "Success",
            message: "found bankcode",
            data: allBankCode,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getBankCodeController = getBankCodeController;
const accountLookUpController = async (req, res) => {
    try {
        const { accountNumber, bankCode } = req.body;
        const foundAccount = await (0, User_1.accountLookUp)(accountNumber, bankCode);
        return res.json({
            status: "Success",
            message: "found account",
            data: foundAccount.data,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.accountLookUpController = accountLookUpController;
const payOutController = async (req, res) => {
    try {
        const { bankCode, accountNumber, accountName, amount } = req.body;
        const user = req.user;
        //check if user avaliableBalance is greater than the amount
        if (amount > user.availableBalance) {
            return res.json({
                status: "Failed",
                message: "insufficient fund",
            });
        }
        const payment = await (0, User_1.payOut)(user, bankCode, amount, accountNumber, accountName);
        let balanceBefore = user.availableBalance;
        let balanceAfter = user.availableBalance - Number(amount);
        let remark = `${user.firstName} ${user.lastName} payout to ${accountName}`;
        //withdraw money fro  user availiable
        await (0, User_1.withdraw)(user, amount);
        //save transaction record
        const transaction = await (0, User_1.createUserTransaction)(user._id.toString(), "withdrawal", payment.data.transaction_reference, amount, balanceBefore, balanceAfter, remark, "success", new Date(), `${user.firstName} ${user.lastName}`, accountName);
        return res.json({
            status: "Success",
            message: "transaction completed",
            data: transaction,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.payOutController = payOutController;
const getUserTransactionsController = async (req, res) => {
    try {
        const user = req.user;
        const foundTransaction = await (0, User_1.getUserTransactions)(user._id.toString());
        return res.json({
            status: "Success",
            message: "Found Transaction",
            data: foundTransaction,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getUserTransactionsController = getUserTransactionsController;
const getUserSingleTransactionController = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const foundTransaction = await (0, User_1.getUserSingleTransaction)(user._id.toString(), id);
        return res.json({
            status: "Success",
            message: "Found Transaction",
            data: foundTransaction,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getUserSingleTransactionController = getUserSingleTransactionController;
const getUserTransactionByStatusController = async (req, res) => {
    try {
        const { status } = req.params;
        const user = req.user;
        const foundTransaction = await (0, User_1.getUserTransactionByStatus)(user._id.toString(), status);
        return res.json({
            status: "Success",
            message: "Found Transaction",
            data: foundTransaction,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getUserTransactionByStatusController = getUserTransactionByStatusController;
const getUserTransactionByTypeController = async (req, res) => {
    try {
        const { type } = req.params;
        const user = req.user;
        const foundTransaction = await (0, User_1.getUserTransactionByType)(user._id.toString(), type);
        return res.json({
            status: "Success",
            message: "Found Transaction",
            data: foundTransaction,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getUserTransactionByTypeController = getUserTransactionByTypeController;
const userGetAllSubRegionController = async (req, res) => {
    try {
        const subRegions = await (0, User_1.userGetAllSubRegion)();
        return res.json({
            status: "Success",
            message: "found all subregion",
            data: subRegions,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.userGetAllSubRegionController = userGetAllSubRegionController;
const joinSavingsController = async (req, res) => {
    try {
        const user = req.user;
        const { circleId } = req.body;
        const jointSavings = await (0, User_1.joinSavings)(user, circleId);
        return res.json({
            status: "Success",
            message: "joined savings group successfuly",
            data: jointSavings,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.joinSavingsController = joinSavingsController;
const getAvaliableSavingsController = async (req, res) => {
    try {
        const user = req.user;
        const allAvaliableSavings = await (0, User_1.avaliableSavings)(user);
        return res.json({
            status: "Success",
            message: "found savings",
            data: allAvaliableSavings,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getAvaliableSavingsController = getAvaliableSavingsController;
const getUserActiveSavingsController = async (req, res) => {
    try {
        const user = req.user;
        const activeSavings = await (0, User_1.userActiveSavingsRecord)(user);
        return res.json({
            status: "Success",
            message: "found savings",
            data: activeSavings,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getUserActiveSavingsController = getUserActiveSavingsController;
const getUserSavingsRecordsController = async (req, res) => {
    try {
        const user = req.user;
        const foundRecords = await (0, User_1.userSavingsRecords)(user);
        return res.json({
            status: "Success",
            message: "found savings",
            data: foundRecords,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getUserSavingsRecordsController = getUserSavingsRecordsController;
