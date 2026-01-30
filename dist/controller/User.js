"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateAccountController = exports.assignReferralCodeToExistingUserController = exports.checkUserSingleReferralRecordController = exports.checkUserReferralRecordsByStatusController = exports.checkUserReferralRecordsController = exports.getSingleTerminalTransactionController = exports.getTerminalTransactionController = exports.getTerminalDetailsController = exports.topUpLottryAccountController = exports.getUserTotalSavingsAndLoanBalanceController = exports.getFixedSavingsByStatusController = exports.getAllFixedSavingsController = exports.getCompletedFixedSavingsController = exports.getActiveFixedSavingsController = exports.createFixedSavingController = exports.getUserSavingsRecordsByStatusController = exports.getSavingsCircleByIdController = exports.getAllUserSavingsRecordController = exports.getUserActiveSavingsRecordController = exports.getAvaliableSavingsController = exports.createPersonalSavingsCircleController = exports.joinSavingsController = exports.userGetAllSubRegionController = exports.getUserTransactionByTypeController = exports.getUserTransactionByStatusController = exports.getUserSingleTransactionController = exports.getUserTransactionsController = exports.getAccountBalanceController = exports.payOutController = exports.accountLookUpController = exports.getBankCodeController = exports.buyDataController = exports.buyAirtimeController = exports.getDataPlanController = exports.updateTransactionPinController = exports.createTransactionPinController = exports.getUserKyc1RecordController = exports.updateKYC1RecordController = exports.registerKYC1 = exports.changePasswordController = exports.updateProfileController = exports.resetPasswordController = exports.initPasswordResetController = exports.userProfile = exports.loginUser = exports.resendUserVerificationEmail = exports.verifyEmail = exports.registerUser = void 0;
const argon2_1 = __importDefault(require("argon2"));
const User_1 = require("../services/User");
const Savings_1 = require("../services/Savings");
const JWT_1 = require("../config/JWT");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const Savings_2 = require("../services/Savings");
const tools_1 = require("../config/tools");
const Admin_config_1 = __importDefault(require("../model/Admin_config"));
const Loan_1 = require("../services/Loan");
const Terminal_1 = require("../services/Terminal");
const referral_1 = require("../services/referral");
const QOREID_API_KEY = process.env.QOREID_SECRET_KEY;
const QOREID_BASE_URL = process.env.QOREID_BASE_URL;
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const getNextFiveMinutes = () => {
    const now = new Date();
    const next = new Date(now.getTime() + 10 * 60 * 1000); // add 5 minutes
    return next;
};
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, gender, dateOfBirth, phoneNumber, referralCode, } = req.body;
        let hashPassword = await argon2_1.default.hash(password);
        const foundUser = await (0, User_1.getUserByEmail)(email);
        if (foundUser) {
            return res.json({
                status: "Failed",
                message: "user already found with this email"
            });
        }
        const newUser = await (0, User_1.createNewUser)(firstName, lastName, email.toLowerCase(), hashPassword, gender, dateOfBirth, phoneNumber);
        if (!newUser) {
            console.log("User creation returned null/undefined");
            return res.status(500).json({
                status: "Failed",
                message: "Failed to create user, please try again later",
            });
        }
        // Send verification code
        const tokenNumber = Math.floor(100000 + Math.random() * 900000);
        const expTime = getNextFiveMinutes();
        console.log("Token expiry:", expTime);
        let token = await (0, User_1.assignUserEmailVerificationToken)(email, tokenNumber, expTime);
        if (!token) {
            console.log("Failed to generate verification token");
            return res.status(500).json({
                status: "Failed",
                message: "Failed to generate verification token",
            });
        }
        console.log("Verification token assigned");
        // Send email
        const msg = {
            to: newUser.email,
            from: `David <davidosinnowo1@gmail.com>`,
            subject: "Welcome to VSAVE 🎉",
            html: `Hello ${newUser.firstName}, welcome to our VSave! ,your trusted partner for smart saving and easy loans. To get started, please verify your email using the code below:
           CODE : ${tokenNumber}
           This code will expire in 5 minutes, so be sure to use it right away.
           We're excited to have you on board!

          — The VSave Team.`,
        };
        console.log("Sending email via SendGrid...");
        const sentMail = await mail_1.default.send(msg);
        console.log("Email sent successfully:", sentMail);
        // check for referral code 
        let referralErr = "";
        if (referralCode) {
            const referralType = (0, referral_1.getUserTypeWithReferralCode)(referralCode);
            const userReferred = await (0, referral_1.assignReferral)(newUser._id.toString(), referralCode, referralType);
            if (userReferred === "Successful") {
                const foundUser = await (0, User_1.getReferalByReferalCode)(referralCode);
                newUser.referredBy = foundUser._id;
                await newUser.save();
            }
            referralErr = userReferred.message;
        }
        // generate referral code 
        await (0, referral_1.createReferralCodeForUser)(newUser._id.toString());
        console.log("finish creating account");
        return res.json({
            status: "Success",
            message: `User created successfully. Verify your email - verification code has been sent to ${newUser.email} (also check your spam meesage for the code )`,
            data: newUser,
            err: referralErr
        });
    }
    catch (err) {
        console.error("=== UNEXPECTED ERROR ===");
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        console.error("Error code:", err.code);
        console.error("Error details:", err);
        console.error("=== END ERROR ===");
        // In development, return detailed error
        const errorMessage = process.env.NODE_ENV === "production"
            ? "An unexpected error occurred. Please try again later."
            : `Error: ${err.message} - ${err.stack}`;
        return res.status(500).json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.registerUser = registerUser;
const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = (await (0, User_1.getUserByEmail)(email));
        const verifyToken = (await (0, User_1.getUserVerificationToken)(email, code));
        for (const token of verifyToken) {
            if (token.token === code.toString()) {
                user.isEmailVerified = true;
                await user.save();
                // register KYC
                await (0, User_1.createKYCRecord)(user);
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
        //  config mail option
        const msg = {
            to: user.email,
            from: `David <davidosinnowo1@gmail.com>`,
            subject: "Welcome to VSAVE 🎉",
            html: `Hello ${user.firstName}, welcome to our VSave! ,your trusted partner for smart saving and easy loans. To get started, please verify your email using the code below:
           CODE : ${tokenNumber}
           This code will expire in 5 minutes, so be sure to use it right away.
           We're excited to have you on board!

          — The VSave Team.`,
        };
        const sentMail = await mail_1.default.send(msg);
        const expTime = getNextFiveMinutes();
        await (0, User_1.assignUserEmailVerificationToken)(user.email, tokenNumber, expTime);
        return res.json({
            status: "Success",
            message: "Verification code has been sent to your email again (also check your spam meesage for the code ) ! ",
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
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = (await (0, User_1.getUserByEmail)(email.toLowerCase()));
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
                from: `David <davidosinnowo1@gmail.com>`,
                subject: "Welcome to VSAVE 🎉",
                html: `Hello ${user.firstName}, welcome to our VSave! ,your trusted partner for smart saving and easy loans. To get started, please verify your email using the code below:
           CODE : ${tokenNumber}
           This code will expire in 5 minutes, so be sure to use it right away.
           We're excited to have you on board!

          — The VSave Team.`,
            };
            const sentMail = await mail_1.default.send(msg);
            const expTime = getNextFiveMinutes();
            await (0, User_1.assignUserEmailVerificationToken)(user.email, tokenNumber, expTime);
            return res.json({
                status: "Failed",
                message: "Account is not Verified you just need to verify with your Email , a token has been sent to this Email check and verify (also check your spam meesage for the code )",
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
        const signedUser = await (0, User_1.getUserByIdPublicUse)(user._id.toString());
        // Return success with JWT token
        return res.json({
            status: "Success",
            message: "login successfuly",
            token: (0, JWT_1.signUserToken)(signedUser),
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
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.userProfile = userProfile;
const initPasswordResetController = async (req, res) => {
    try {
        const { email } = req.body;
        const foundUser = await (0, User_1.getUserByEmail)(email);
        if (!foundUser) {
            return res.json({
                status: "Failed",
                message: "no user found with this email"
            });
        }
        ;
        const tokenNumber = Math.floor(100000 + Math.random() * 900000);
        const expTime = getNextFiveMinutes();
        await (0, User_1.assignUserEmailVerificationToken)(foundUser.email, tokenNumber, expTime);
        //  config mail option
        const msg = {
            to: foundUser.email,
            from: `David <davidosinnowo1@gmail.com>`,
            subject: "VSave Password Reset",
            html: `Hello ${foundUser.firstName}, You have requested a password reset.
            Please use the code ${tokenNumber} to proceed with resetting your password,
            token expires in 10 mins .
            If you did not initiate this request, you can safely ignore this email. 
            Your security is important to us. Thank you!

          — The VSave Team.`,
        };
        const sentMail = await mail_1.default.send(msg);
        console.log("email sent successfuly:", sentMail);
        return res.json({
            status: "Success",
            message: `reset code sent to ${foundUser.email} check your email and procced to reset your password`
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.initPasswordResetController = initPasswordResetController;
const resetPasswordController = async (req, res) => {
    try {
        const { email, code, password } = req.body;
        const foundUser = await (0, User_1.getUserByEmail)(email);
        const verifyToken = (await (0, User_1.getUserVerificationToken)(email, code));
        console.log("allToken:", verifyToken);
        for (const token of verifyToken) {
            if (token.token === code.toString()) {
                let hashPassword = await argon2_1.default.hash(password);
                const changedPassword = await (0, User_1.changePassword)(foundUser, hashPassword);
                return res.json({
                    status: "Success",
                    message: "password changed successfuly",
                    data: changedPassword,
                });
            }
        }
        const tokenExist = await (0, User_1.confirmTokenExist)(email, code);
        if (tokenExist) {
            return res.json({
                status: "Failed",
                message: "Expired token",
            });
        }
        return res.json({
            status: "Failed",
            message: "Incorrect code ",
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.resetPasswordController = resetPasswordController;
const updateProfileController = async (req, res) => {
    try {
        const { firstName, email, lastName, phoneNumber } = req.body;
        const user = req.user;
        const updatedProfile = await (0, User_1.updateProfile)(user, firstName, lastName, email, phoneNumber);
        return res.json({
            status: "Success",
            message: "profile updated successfuly",
            data: updatedProfile,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.updateProfileController = updateProfileController;
const changePasswordController = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const user = req.body;
        const verifyPassword = await argon2_1.default.verify(user.password, oldPassword);
        if (!verifyPassword) {
            return res.json({
                status: "Failed",
                message: "incorrect old Password",
            });
        }
        let hashPassword = await argon2_1.default.hash(newPassword);
        const changedPassword = await (0, User_1.changePassword)(user, hashPassword);
        return res.json({
            status: "Success",
            message: "password changed successfuly",
            data: changedPassword,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.changePasswordController = changePasswordController;
const registerKYC1 = async (req, res) => {
    try {
        const { profession, accountNumber, bank, accountDetails, bankCode, country, state, bvn, address, region, transactionPin, } = req.body;
        const user = req.user;
        // check if KYC record already exisyt
        const foundKYC = await (0, User_1.getUserKyc1Record)(user._id.toString());
        if (foundKYC) {
            return res.json({
                status: "Failed",
                message: "KYC record already exist",
            });
        }
        // change KYC status
        console.log("got here start virtual account creattion");
        const virtualAccount = await (0, User_1.createVirtualAccountForPayment)(user, bvn, address);
        if (virtualAccount.success === "false") {
            return res.json({
                status: "Failed",
                message: "something went wrong, account number not created"
            });
        }
        await (0, User_1.createVirtualAccountIndex)(user._id.toString(), virtualAccount.data.virtual_account_number);
        console.log("got here kyc record creation");
        // save KYC1
        const newKYC1 = await (0, User_1.createKYC1Record)(user, profession, country, state, bvn, address, region, accountNumber, bank, accountDetails, bankCode);
        console.log("got here  virtual account is created", User_1.createKYC1Record);
        user.profession = profession;
        await user.save();
        console.log("got here proffession saved");
        if (profession === "Lottery Agent") {
            await (0, Terminal_1.generateAndAsignLottoryId)(user._id.toString());
        }
        console.log("got here if it's lotto agent completed");
        // create transaction pin 
        await (0, User_1.createTransactionPin)(user._id.toString(), transactionPin);
        console.log("got here transaction pin created");
        if (!newKYC1) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
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
const updateKYC1RecordController = async (req, res) => {
    try {
        const { profession, bank, accountNumber, accountDetails, bankCode, country, state, address, } = req.body;
        const user = req.user;
        if (profession === "Lottery Agent") {
            let newLottoId = await (0, Terminal_1.generateAndAsignLottoryId)(user._id.toString());
            const updatedKYC1 = await (0, User_1.updateKYC1Record)(user, profession, bank, accountNumber, accountDetails, bankCode, country, state, address);
            return res.json({
                status: "Success",
                message: "KYC updated successfuly",
                data: updatedKYC1,
            });
        }
        const updatedKYC1 = await (0, User_1.updateKYC1Record)(user, profession, bank, accountNumber, accountDetails, bankCode, country, state, address);
        return res.json({
            status: "Success",
            message: "KYC updated successfuly",
            data: updatedKYC1,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.updateKYC1RecordController = updateKYC1RecordController;
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
const createTransactionPinController = async (req, res) => {
    try {
        const user = req.user;
        const { pin } = req.body;
        console.log("req.pin:", pin);
        const newRecord = await (0, User_1.createTransactionPin)(user._id.toString(), pin);
        return res.json({
            status: "Success",
            message: "transaction pin updated successfuly",
            data: newRecord,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.createTransactionPinController = createTransactionPinController;
const updateTransactionPinController = async (req, res) => {
    try {
        const user = req.user;
        const { oldPin, newPin } = req.body;
        if (oldPin !== user.pin) {
            return res.json({
                status: "Failed",
                message: "Incorrect old pin",
            });
        }
        const updateRecord = await (0, User_1.createTransactionPin)(user._id.toString(), newPin);
        return res.json({
            status: "Success",
            message: "Pin updated successfuly",
            data: updateRecord,
        });
    }
    catch (err) {
        throw err;
    }
};
exports.updateTransactionPinController = updateTransactionPinController;
// export const validateTransactionPinController = async (
//     req: Request,
//     res: Response,
// ) => {
//     try {
//         const { pin } = req.body;
//         const user = req.user as IUser;
//         const isValid = await validateTransactionPin(user._id.toString(), pin);
//         if (isValid) {
//             req.validateTransactionPin.pin = pin;
//             req.validateTransactionPin.status = true;
//             return res.json({
//                 status: "Success",
//                 message: "Transaction pin Validation successful",
//             });
//         }
//         req.validateTransactionPin.pin = 0;
//         req.validateTransactionPin.status = false;
//         return res.json({
//             status: "Failed",
//             message: "Incorrect pin",
//         });
//     } catch (err: any) {
//         return res.json({
//             status: "Failed",
//             message: err.message,
//             err,
//         });
//     }
// };
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
            data: dataPlan.data,
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
        const { pin, phoneNumber, amount } = req.body;
        const user = req.user;
        // validate transaction pin to procced
        console.log("validate:", pin.toString(), user.pin.toString());
        if (pin.toString() !== user.pin.toString()) {
            return res.json({
                status: "Failed",
                message: "Transaction pin is incorrect enter the correct pin",
            });
        }
        console.log("validation completed");
        // check if avaliablebalance is greater than the purchased amount
        if (amount > user.availableBalance) {
            console.log("insuficient");
            return res.json({
                status: "Failed",
                message: "Insufficient Fund Topup your account and try again",
            });
        }
        console.log("start buy airtime process");
        const airtime = await (0, User_1.buyAirtime)(phoneNumber, amount);
        console.log("finish buy airtime process");
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
            err,
        });
    }
};
exports.buyAirtimeController = buyAirtimeController;
const buyDataController = async (req, res) => {
    try {
        const { pin, phoneNumber, amount, planCode } = req.body;
        const user = req.user;
        // validate transaction pin to procced
        if (pin.toString() !== user.pin.toString()) {
            return res.json({
                status: "Failed",
                message: "Transaction pin is incorrect enter the correct pin",
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
        const { pin, bankCode, accountNumber, accountName, amount, remark } = req.body;
        const user = req.user;
        // validate transaction pin to procced
        if (pin.toString() !== user.pin.toString()) {
            return res.json({
                status: "Failed",
                message: "Transaction pin is incorrect enter the correct pin",
            });
        }
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
const getAccountBalanceController = async (req, res) => {
    try {
        const user = req.user;
        const balanceResult = await (0, User_1.getAccountBalance)(user._id.toString());
        return res.json({
            status: "Success",
            message: "balance found",
            data: balanceResult
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getAccountBalanceController = getAccountBalanceController;
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
function getTomorrowDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
}
const joinSavingsController = async (req, res) => {
    try {
        const user = req.user;
        const { circleId, autoRestartEnabled } = req.body;
        const foundSavingsCircle = await (0, User_1.getCircleById)(circleId);
        let startDate = getTomorrowDate();
        let endDate = (0, tools_1.calculateEndDate)(foundSavingsCircle.frequency, startDate, foundSavingsCircle.duration);
        const jointSavings = await (0, Savings_2.joinSavings)(user, circleId, autoRestartEnabled, startDate, endDate, "PAUSED");
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
const createPersonalSavingsCircleController = async (req, res) => {
    try {
        const { savingsTitle, frequency, duration, deductionPeriod, savingsAmount, startDate, autoRestartEnabled, } = req.body;
        let user = req.user;
        const { firstTimeAdminFee } = await Admin_config_1.default.getSettings();
        // Parse the startDate in the local time zone
        const localStartDate = new Date(startDate);
        localStartDate.setHours(0, 0, 0, 0); // Normalize to the start of the day in local time ;
        let endDate = (0, tools_1.calculateEndDate)(frequency, localStartDate, duration);
        let maturityAmount = (0, tools_1.calculateMaturityAmount)(frequency, duration, savingsAmount, Number(firstTimeAdminFee));
        console.log("maturity amount:", maturityAmount);
        const newSavingsCircle = await (0, Savings_2.createUserPersonalSavings)(user, savingsTitle, frequency, duration, deductionPeriod, savingsAmount, maturityAmount, localStartDate, endDate, autoRestartEnabled);
        return res.json({
            status: "Success",
            message: "savings created successfuly",
            data: newSavingsCircle,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.createPersonalSavingsCircleController = createPersonalSavingsCircleController;
const getAvaliableSavingsController = async (req, res) => {
    try {
        const user = req.user;
        const allAvaliableSavings = await (0, Savings_2.getAllActiveSavingsCircle)(user.region.toString());
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
const getUserActiveSavingsRecordController = async (req, res) => {
    try {
        const user = req.user;
        const record = await (0, Savings_2.getUserActiveSavingsRecord)(user);
        return res.json({
            status: "Success",
            message: "found savings plan",
            data: record,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getUserActiveSavingsRecordController = getUserActiveSavingsRecordController;
const getAllUserSavingsRecordController = async (req, res) => {
    try {
        const user = req.user;
        const record = await (0, Savings_2.userSavingsRecords)(user);
        return res.json({
            status: "Success",
            message: "found savings plan",
            data: record,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getAllUserSavingsRecordController = getAllUserSavingsRecordController;
const getSavingsCircleByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const foundCircle = await (0, Savings_2.checkForCircleById)(id.toString());
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
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getSavingsCircleByIdController = getSavingsCircleByIdController;
const getUserSavingsRecordsByStatusController = async (req, res) => {
    try {
        const user = req.user;
        const { status } = req.body;
        const foundRecords = await (0, Savings_1.getUserSavingsRecordByStatus)(user._id.toString(), status);
        return res.json({
            status: "Success",
            message: "foundRecord",
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
exports.getUserSavingsRecordsByStatusController = getUserSavingsRecordsByStatusController;
function getFixedEndDate(startDate, durationInDays) {
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const day = startDate.getDate() + durationInDays;
    const hour = startDate.getHours();
    return new Date(year, month, day, hour, 0, 0, 0);
}
const createFixedSavingController = async (req, res) => {
    try {
        const user = req.user;
        const { amount, title, interestPayoutType, duration } = req.body;
        const { fixedSavingsAnualInterest } = await Admin_config_1.default.getSettings();
        // withdaw money from user account
        let remark = `deposit of ${amount} to your fixed savings account`;
        const withdrawal = await (0, User_1.userWithdraw)(user._id.toString(), amount, remark);
        if (withdrawal === "Insufficient Funds") {
            return res.json({
                status: "Failed",
                message: "Insufficient funds to initiate fixed savings",
            });
        }
        const { interestAmount, interestPercentage } = (0, tools_1.calculateProportionalInterest)(amount, Number(fixedSavingsAnualInterest), duration);
        let sender = `${user.firstName} ${user.lastName}`;
        let depositRemark = `interest deposit on fixed savings`;
        let startDate = (0, tools_1.getCurrentDateWithClosestHour)();
        let endDate = getFixedEndDate(startDate, Number(duration));
        if (interestPayoutType === "UPFRONT") {
            const deposit = await (0, User_1.userDeposit)(user._id.toString(), interestAmount, (0, tools_1.generateSavingsRefrenceCode)(), new Date(), sender, depositRemark);
            const newSavingsRecord = await (0, User_1.createFixedSaving)(user._id.toString(), title, amount, interestPercentage.toString(), amount, Number(duration), startDate, endDate, "active", "UPFRONT", interestAmount);
            return res.json({
                status: "Success",
                message: "fixed savings created successfully",
                data: newSavingsRecord,
            });
        }
        let payout = amount + interestAmount;
        const newSavingsRecord = await (0, User_1.createFixedSaving)(user._id.toString(), title, amount, interestPercentage.toString(), payout, Number(duration), startDate, endDate, "active", "MATURITY", interestAmount);
        return res.json({
            status: "Success",
            message: "fixed savings created successfully",
            data: newSavingsRecord,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.createFixedSavingController = createFixedSavingController;
const getActiveFixedSavingsController = async (req, res) => {
    try {
        const user = req.user;
        const allRecord = await (0, Savings_1.getUserActiveFixedSavings)(user);
        return res.json({
            status: "Success",
            message: "all record found",
            data: allRecord,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getActiveFixedSavingsController = getActiveFixedSavingsController;
const getCompletedFixedSavingsController = async (req, res) => {
    try {
        const user = req.user;
        const allRecord = await (0, Savings_1.getUserCompletedFixedSavings)(user);
        return res.json({
            status: "Success",
            message: "all record found",
            data: allRecord,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getCompletedFixedSavingsController = getCompletedFixedSavingsController;
const getAllFixedSavingsController = async (req, res) => {
    try {
        const user = req.user;
        const allRecord = await (0, Savings_1.getUserFixedSavings)(user);
        return res.json({
            status: "Success",
            message: "all record found",
            data: allRecord,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getAllFixedSavingsController = getAllFixedSavingsController;
const getFixedSavingsByStatusController = async (req, res) => {
    try {
        const user = req.user;
        const { status } = req.body;
        const foundRecord = await (0, Savings_1.getFixedSavingsByStatus)(user._id.toString(), status);
        return res.json({
            status: "Success",
            message: "found record",
            data: foundRecord,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getFixedSavingsByStatusController = getFixedSavingsByStatusController;
const getUserTotalSavingsAndLoanBalanceController = async (req, res) => {
    try {
        const user = req.user;
        const totalSavingsBalnce = await (0, Savings_1.getUserTotalSavingsBalance)(user._id.toString());
        const totalLoanBalance = await (0, Loan_1.getAllLoanRecordBalance)(user._id.toString());
        return res.json({
            status: "Success",
            message: "savings balance calculated",
            data: {
                totalSavingsBalnce,
                totalLoanBalance
            }
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getUserTotalSavingsAndLoanBalanceController = getUserTotalSavingsAndLoanBalanceController;
const topUpLottryAccountController = async (req, res) => {
    try {
        const { amount, pin, remark } = req.body;
        const user = req.user;
        // check if user is a lotto user 
        if (!user.lottoryId) {
            return res.json({
                status: "Failed",
                message: "not a lotto user",
            });
        }
        // validate transaction pin to procced
        if (pin.toString() !== user.pin.toString()) {
            return res.json({
                status: "Failed",
                message: "Transaction pin is incorrect enter the correct pin",
            });
        }
        //check if user avaliableBalance is greater than the amount
        if (amount > user.availableBalance) {
            return res.json({
                status: "Failed",
                message: "insufficient fund",
            });
        }
        const foundKYC = await (0, User_1.getUserKyc1Record)(user._id.toString());
        let bankCode = foundKYC.bankCode;
        let accountNumber = foundKYC.accountNumber.toString();
        let accountName = foundKYC.accountDetails;
        const payment = await (0, User_1.payOut)(user, bankCode, amount.toString(), accountNumber, accountName);
        //withdraw money from  user availiable
        await (0, User_1.userWithdraw)(user._id.toString(), amount, remark, payment.data.transaction_reference);
        // also create TerminalTransaction record 
        const terminalRecord = await (0, Terminal_1.createTerminalRecord)(user._id.toString(), amount, payment.data.transaction_reference, remark);
        await (0, Terminal_1.depositToTerminalAccount)(user._id.toString(), amount);
        return res.json({
            status: "Success",
            message: "terminal credited successfully",
            data: terminalRecord
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.topUpLottryAccountController = topUpLottryAccountController;
const getTerminalDetailsController = async (req, res) => {
    try {
        const user = req.user;
        const details = await (0, Terminal_1.getTerminalDetails)(user._id.toString());
        return res.json({
            status: "Success",
            message: "found details",
            data: details
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getTerminalDetailsController = getTerminalDetailsController;
const getTerminalTransactionController = async (req, res) => {
    try {
        const user = req.user;
        const foundRecords = await (0, Terminal_1.getTerminalTransaction)(user._id.toString());
        return res.json({
            status: "Success",
            message: "found records",
            data: foundRecords
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getTerminalTransactionController = getTerminalTransactionController;
const getSingleTerminalTransactionController = async (req, res) => {
    try {
        const { id } = req.params;
        const foundRecord = await (0, Terminal_1.getSingleTerminalTransaction)(id);
        return res.json({
            status: "Success",
            message: "found Transaction",
            data: foundRecord
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getSingleTerminalTransactionController = getSingleTerminalTransactionController;
const checkUserReferralRecordsController = async (req, res) => {
    try {
        const user = req.user;
        const allRecords = await (0, referral_1.getAllUserReferralRecord)(user._id.toString());
        return res.json({
            status: "Success",
            message: "Found Records",
            data: allRecords
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.checkUserReferralRecordsController = checkUserReferralRecordsController;
const checkUserReferralRecordsByStatusController = async (req, res) => {
    try {
        const user = req.user;
        const { status } = req.params;
        const allRecords = await (0, referral_1.getUserReferralByStatus)(user._id.toString(), status);
        return res.json({
            status: "Success",
            message: "Found Records",
            data: allRecords
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.checkUserReferralRecordsByStatusController = checkUserReferralRecordsByStatusController;
const checkUserSingleReferralRecordController = async (req, res) => {
    try {
        const { id } = req.params;
        const foundRecord = await (0, referral_1.getSingleReferralRecord)(id);
        return res.json({
            status: "Success",
            message: "Found Record",
            data: foundRecord
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.checkUserSingleReferralRecordController = checkUserSingleReferralRecordController;
const assignReferralCodeToExistingUserController = async (req, res) => {
    try {
        let task = await (0, referral_1.assignReferralCodeToExistingUser)();
        return res.json({
            status: "Success",
            message: "task completed",
            data: task
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.assignReferralCodeToExistingUserController = assignReferralCodeToExistingUserController;
const deactivateAccountController = async (req, res) => {
    try {
        const user = req.user;
        const deletedAccount = await (0, User_1.deactivateAccount)(user._id.toString());
        return res.json({
            status: "Success",
            message: "account deleted  successfuly",
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.deactivateAccountController = deactivateAccountController;
