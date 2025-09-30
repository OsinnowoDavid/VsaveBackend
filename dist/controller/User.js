"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerKYC1 = exports.getBanksAndCode = exports.userProfile = exports.loginUser = exports.resendUserVerificationEmail = exports.verifyEmail = exports.registerUser = void 0;
const argon2_1 = __importDefault(require("argon2"));
const User_1 = require("../services/User");
const JWT_1 = require("../config/JWT");
const nodemailer_1 = __importDefault(require("../config/nodemailer"));
const axios_1 = __importDefault(require("axios"));
const QOREID_API_KEY = process.env.QOREID_SECRET_KEY;
const QOREID_BASE_URL = process.env.QOREID_BASE_URL;
console.log("Q:", QOREID_BASE_URL);
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        let hashPassword = await argon2_1.default.hash(password);
        // check if user is already in the database
        const user = (await (0, User_1.getUserByEmail)(email));
        // first check if it is a user that is in the database but didn't verify email
        if (user) {
            return res.json({
                status: "Failed",
                message: "User already exists Login Instead !",
                isEmailVerified: user.isEmailVerified,
            });
        }
        // create new user
        const newUser = await (0, User_1.createNewUser)(firstName, lastName, email, hashPassword);
        if (!newUser) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
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
        const token = await (0, User_1.assignUserEmailVerificationToken)(email, tokenNumber, expTime);
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
        await nodemailer_1.default.sendMail(mailOptions);
        return res.json({
            status: "Success",
            message: `User created successfuly verify your email ,verification code has been sent to ${newUser.email}`,
            data: newUser,
        });
    }
    catch (err) {
        res.json({
            Status: "Failed",
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
            Status: "Failed",
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
            status: "success",
            message: "Verification code has been sent to your email again !",
            isEmailVerified: user.isEmailVerified,
        });
    }
    catch (err) {
        res.json({
            Status: "Failed",
            message: err.message,
        });
    }
};
exports.resendUserVerificationEmail = resendUserVerificationEmail;
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
            const getNextFiveMinutes = () => {
                const now = new Date();
                const next = new Date(now.getTime() + 5 * 60 * 1000); // add 5 minutes
                return next;
            };
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
            status: "success",
            message: "login successfuly",
            token: (0, JWT_1.signUserToken)(user),
        });
    }
    catch (err) {
        res.json({
            Status: "Failed",
            message: err.message,
        });
    }
};
exports.loginUser = loginUser;
const userProfile = async (req, res) => {
    try {
        let user = req.user;
        if (!user) {
            return res.json({
                Status: "Failed",
                message: "user not found",
            });
        }
        return res.json({
            Status: "success",
            message: "welcome back",
            data: user,
        });
    }
    catch (err) {
        res.json({
            Status: "Failed",
            message: err.message,
        });
    }
};
exports.userProfile = userProfile;
const getBanksAndCode = async (req, res) => {
    try {
        const BanksAndCode = await (0, User_1.getAllBanksAndCode)();
        if (!BanksAndCode) {
            return res.json({
                Status: "Failed",
                message: "no Bank Code found",
            });
        }
        return res.json({
            Status: "Success",
            message: "Bank Code found",
            data: BanksAndCode,
        });
    }
    catch (err) {
        res.json({
            Status: "Failed",
            message: err.message,
        });
    }
};
exports.getBanksAndCode = getBanksAndCode;
// export const verifyBankAccountController = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const { accountNumber, bankCode } = req.body;
//     const verifiedAccount = await verifyBankaccount(accountNumber, bankCode);
//     if (!verifiedAccount) {
//       return res.json({
//         Status: "Failed",
//         message: "No Account Found",
//       });
//     }
//     return res.json({
//       Status: "Success",
//       message: "Account Found",
//       data: verifiedAccount,
//     });
//   } catch (err: any) {
//     res.json({
//       Status: "Failed",
//       message: err.message,
//     });
//   }
// };
const registerKYC1 = async (req, res) => {
    try {
        const { profession, accountNumber, bank, bankCode, accountDetails, country, state, bvn, } = req.body;
        const user = req.user;
        console.log("got here begining of the controller");
        console.log("key:", QOREID_API_KEY);
        const options = {
            method: "POST",
            url: "https://api.qoreid.com/v1/ng/identities/bvn-basic/95888168924",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
            },
            data: { firstname: "Bunch", lastname: "Dillon" },
        };
        const bvnData = await axios_1.default.request(options);
        // save KYC1
        const newKYC1 = await (0, User_1.createKYC1Record)(user, profession, accountNumber, bank, accountDetails, country, state, bvn);
        if (!newKYC1) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
        // change KYC status
        await (0, User_1.kycStatusChange)(user, "verified", 1);
        return res.json({
            Status: "success",
            message: "KYC1 record created successfuly",
            data: newKYC1,
        });
    }
    catch (err) {
        console.log("error:", err.message);
        return res.json({
            Status: "Failed",
            message: err.message,
        });
    }
};
exports.registerKYC1 = registerKYC1;
