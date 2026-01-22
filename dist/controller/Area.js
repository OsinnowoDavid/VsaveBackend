"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPasswordController = exports.createOfficerController = void 0;
const Area_1 = require("../services/Area");
const tools_1 = require("../config/tools");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const createOfficerController = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, area, profilePicture } = req.body;
        const referralCode = (0, tools_1.generateReferralRefrenceCode)("AGENT");
        const newOfficer = await (0, Area_1.createOfficer)(firstName, lastName, email, phoneNumber, area, referralCode, "1", profilePicture);
        const tokenNumber = Math.floor(100000 + Math.random() * 900000);
        newOfficer.VerificationToken = tokenNumber;
        await newOfficer.save();
        // Send email
        const msg = {
            to: newOfficer.email,
            from: `David <davidosinnowo1@gmail.com>`,
            subject: "Welcome to VSAVE Admin Panel🎉",
            html: `Dear ${newOfficer.firstName},
                                Welcome aboard! We’re thrilled to have you as part of the GVC marketing team. 
                                you’ll play a crucial role in Onboarding User in your designated area.
                                your token to create a login password : ${tokenNumber}
                                your profile details 
                                FullNAme: ${newOfficer.firstName} ${newOfficer.lastName} 
                                email: ${newOfficer.email},
                                phoneNumber: ${newOfficer.phoneNumber} 
                
                      — The VSave Team.`,
        };
        const sentMail = await mail_1.default.send(msg);
        return res.json({
            status: "Success",
            message: "new Account created Successfuly",
            data: newOfficer
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.createOfficerController = createOfficerController;
const createPasswordController = async (req, res) => {
    try {
        const { email, token, password } = req.body;
        const foundOfficer = await (0, Area_1.getOfficerByEmail)(email);
        const verification = await (0, Area_1.verifyToken)(foundOfficer._id.toString(), token);
        if (verification) {
            const createdPassword = await (0, Area_1.createPassword)(foundOfficer._id.toString(), password);
            return res.json({
                status: "Success",
                message: "Password created Successfuly",
                data: createdPassword
            });
        }
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.createPasswordController = createPasswordController;
