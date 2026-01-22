"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAdminSavingsController = exports.approveOrRejectLoanController = exports.getLoanRecordByStatusController = exports.getAllLoanRecordController = exports.getUserSavingsDetailsController = exports.getSavingsDetailsController = exports.getAdminDashboardDetails = exports.getAllAdminByRoleController = exports.getAllAdminController = exports.getAllUserController = exports.getAdminConfigController = exports.setAdminConfigController = exports.getAllSubRegion = exports.assignSubRegionAdminToSubRegionController = exports.createSubRegionController = exports.getRegionalAdminByEmailController = exports.getRegionalAdminsController = exports.getAllRegionalAdminController = exports.getAllRegionController = exports.createNewRegionController = exports.assignRegionalAdminToRegionController = exports.updateAdminRecordController = exports.deleteAminController = exports.superAdminProfileController = exports.LoginSuperAdminController = exports.resendVerificationCodeController = exports.updateAdminPasswordController = exports.createAdminPasswordController = exports.registerAdminController = void 0;
const argon2_1 = __importDefault(require("argon2"));
const Admin_1 = require("../services/Admin");
const JWT_1 = require("../config/JWT");
const Loan_1 = require("../services/Loan");
const Regionaladmin_1 = __importDefault(require("../model/Regionaladmin"));
const User_1 = require("../services/User");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const Savings_1 = require("../services/Savings");
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const getAdminRegionsOrsubregions = async (admin) => {
    try {
        const foundAdmin = await Regionaladmin_1.default.findById(admin);
        let result = {
            regionNames: [],
            subRegionNames: []
        };
        if (foundAdmin.region) {
            for (const region of foundAdmin.region) {
                let foundRegion = await (0, Admin_1.getRegionById)(region);
                result.regionNames.push(foundRegion.regionName);
            }
        }
        if (foundAdmin.subRegion) {
            for (const subRegion of foundAdmin.subRegion) {
                let foundSubRegion = await (0, Admin_1.getSubRegionById)(subRegion);
                result.subRegionNames.push(foundSubRegion.subRegionName);
            }
        }
        return result;
    }
    catch (err) {
        throw err;
    }
};
const registerAdminController = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password, role, profilePicture } = req.body;
        // check if admin account already exist 
        const foundAdmin = await (0, Admin_1.getAdminByEmail)(email);
        if (foundAdmin) {
            return res.json({
                status: "Failed",
                message: "account already exist as an admin."
            });
        }
        const newAdmin = await (0, Admin_1.CreateAdmin)(firstName, lastName, email, phoneNumber, role, profilePicture);
        if (!newAdmin) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
        const tokenNumber = Math.floor(100000 + Math.random() * 900000);
        newAdmin.verificationCode = tokenNumber;
        await newAdmin.save();
        // Send email
        const msg = {
            to: newAdmin.email,
            from: `David <davidosinnowo1@gmail.com>`,
            subject: "Welcome to VSAVE Admin Panel🎉",
            html: `Dear ${newAdmin.firstName},
                    Welcome aboard! We’re thrilled to have you as part of the GVC admin team. 
                    As a ${newAdmin.role}, you’ll play a crucial role in managing and overseeing your designated area.
                    your token to create a login password : ${tokenNumber}
                    your profile details 
                    FullNAme: ${newAdmin.firstName} ${newAdmin.lastName} 
                    email: ${newAdmin.email},
                    phoneNumber: ${newAdmin.phoneNumber} 
                    role: ${newAdmin.role}
    
          — The VSave Team.`,
        };
        const sentMail = await mail_1.default.send(msg);
        return res.json({
            Status: "success",
            message: "SuperAdmin Account created successfuly",
            data: newAdmin,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.registerAdminController = registerAdminController;
const createAdminPasswordController = async (req, res) => {
    try {
        const { code, email, password } = req.body;
        const foundAdmin = await (0, Admin_1.getAdminByEmail)(email);
        let hashPassword = await argon2_1.default.hash(password);
        if (!foundAdmin) {
            return res.json({
                status: "Failed",
                message: "no admin found with this email"
            });
        }
        // first verify code 
        if (foundAdmin.verificationCode !== Number(code)) {
            return res.json({
                status: "Failed",
                message: "Incorrect verification token"
            });
        }
        let createPassword = await (0, Admin_1.createAdminPassword)(foundAdmin._id.toString(), hashPassword);
        return res.json({
            status: "Success",
            message: "Password created",
            data: createPassword
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.createAdminPasswordController = createAdminPasswordController;
const updateAdminPasswordController = async (req, res) => {
    try {
        const user = req.user;
        const { oldPassword, newPassword } = req.body;
        const foundAdmin = await (0, Admin_1.getAdminById)(user._id.toString(), true);
        let verifyPassword = await argon2_1.default.verify(foundAdmin.password, oldPassword);
        if (!verifyPassword) {
            return res.json({
                status: "Failed",
                message: "incorrect old passsword",
            });
        }
        let hashPassword = await argon2_1.default.hash(newPassword);
        const newRecord = await (0, Admin_1.UpdateAdminPassword)(foundAdmin._id.toString(), hashPassword);
        return res.json({
            status: "Success",
            message: "password updated successfuly",
            data: newRecord
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.updateAdminPasswordController = updateAdminPasswordController;
const resendVerificationCodeController = async (req, res) => {
    try {
        const { email } = req.params;
        const foundAdmin = await (0, Admin_1.getAdminByEmail)(email);
        if (!foundAdmin) {
            return res.json({
                status: "Failed",
                message: "no admin found with this email"
            });
        }
        const tokenNumber = Math.floor(100000 + Math.random() * 900000);
        foundAdmin.verificationCode = tokenNumber;
        await foundAdmin.save();
        // Send email
        const msg = {
            to: foundAdmin.email,
            from: `David <danyboy99official@gmail.com>`,
            subject: "Welcome to VSAVE Admin Panel🎉",
            html: `Dear ${foundAdmin.firstName}, 
                    use the last token sent
                    your token to create a login password : ${tokenNumber}
                    your profile details 
                    FullNAme: ${foundAdmin.firstName} ${foundAdmin.lastName} 
                    email: ${foundAdmin.email},
                    phoneNumber: ${foundAdmin.phoneNumber} 
                    role: ${foundAdmin.role}
    
          — The VSave Team.`,
        };
        const sentMail = await mail_1.default.send(msg);
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.resendVerificationCodeController = resendVerificationCodeController;
const LoginSuperAdminController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundAdmin = await (0, Admin_1.getAllSuperAdminByEmail)(email);
        if (!foundAdmin) {
            return res.json({
                status: "Failed",
                message: "User Not Found",
            });
        }
        let verifyPassword = await argon2_1.default.verify(foundAdmin.password, password);
        if (!verifyPassword) {
            return res.json({
                status: "Failed",
                message: "incorrect Passsword",
            });
        }
        // Return success with JWT token
        return res.json({
            Status: "success",
            message: "login successfuly",
            token: (0, JWT_1.signUserToken)(foundAdmin),
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.LoginSuperAdminController = LoginSuperAdminController;
const superAdminProfileController = async (req, res) => {
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
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.superAdminProfileController = superAdminProfileController;
const deleteAminController = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRecord = await (0, Admin_1.deleteAdmin)(id);
        return res.json({
            status: "Success",
            message: "Account deleted Successfuly",
            data: deletedRecord
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.deleteAminController = deleteAminController;
const updateAdminRecordController = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber } = req.body;
        const user = req.user;
        const updatedRecord = await (0, Admin_1.updateAdminRecord)(user._id.toString(), firstName, lastName, email, phoneNumber);
        return res.json({
            status: "Success",
            message: "account updated Successfuly",
            data: updatedRecord
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.updateAdminRecordController = updateAdminRecordController;
const assignRegionalAdminToRegionController = async (req, res) => {
    try {
        const { regionalAdmin, region } = req.body;
        const foundAdmin = await Regionaladmin_1.default.findById(regionalAdmin);
        const assignRegion = await (0, Admin_1.assignRegionalAdmin)(regionalAdmin, region);
        const assignRegionalAdminToRegion = await (0, Admin_1.assignRegionalAdminToRegions)(region, regionalAdmin);
        return res.json({
            status: "Success",
            message: "admin assigned to region"
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.assignRegionalAdminToRegionController = assignRegionalAdminToRegionController;
const createNewRegionController = async (req, res) => {
    try {
        const { regionName, shortCode, location } = req.body;
        const newRegion = await (0, Admin_1.createNewRegion)(regionName, shortCode, location);
        if (!newRegion) {
            return res.json({
                status: "Failed",
                message: "something went wrong, try again later",
            });
        }
        return res.json({
            status: "Success",
            message: "Region  created successfully",
            data: newRegion,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.createNewRegionController = createNewRegionController;
const getAllRegionController = async (req, res) => {
    try {
        const allRegion = await (0, Admin_1.getAllRegion)();
        if (!allRegion) {
            return res.json({
                status: "Failed",
                message: "No Region Found",
            });
        }
        return res.json({
            status: "Success",
            message: "Region Found",
            data: allRegion,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getAllRegionController = getAllRegionController;
const getAllRegionalAdminController = async (req, res) => {
    try {
        const allRegionalAdmin = await (0, Admin_1.getAllRegionalAdmin)();
        if (!allRegionalAdmin) {
            return res.json({
                status: "Failed",
                message: "No Region Found",
            });
        }
        return res.json({
            status: "Success",
            message: "Region Found",
            data: allRegionalAdmin,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getAllRegionalAdminController = getAllRegionalAdminController;
const getRegionalAdminsController = async (req, res) => {
    try {
        const { region } = req.body;
        const allRegionalAdmin = await (0, Admin_1.getRegionalAdmins)(region);
        if (!allRegionalAdmin) {
            return res.json({
                status: "Failed",
                message: "No Region Found",
            });
        }
        return res.json({
            status: "Success",
            message: "Region Found",
            data: allRegionalAdmin,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getRegionalAdminsController = getRegionalAdminsController;
const getRegionalAdminByEmailController = async (req, res) => {
    try {
        const { email } = req.params;
        const foundRegionalAdmin = await (0, Admin_1.getRegionalAdminByEmail)(email);
        return res.json({
            status: "Success",
            message: "Regional admin Found",
            data: foundRegionalAdmin,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getRegionalAdminByEmailController = getRegionalAdminByEmailController;
const createSubRegionController = async (req, res) => {
    try {
        const { subRegionName, shortCode, location, region } = req.body;
        const newSubRegion = await (0, Admin_1.createSubRegion)(subRegionName, shortCode, location, region);
        return res.json({
            status: "Success",
            message: "sub region created successfuly",
            data: newSubRegion
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.createSubRegionController = createSubRegionController;
const assignSubRegionAdminToSubRegionController = async (req, res) => {
    try {
        const { admin, areas } = req.body;
        const foundAdmin = await (0, Admin_1.getAdminById)(admin);
        const assignAdmin = await (0, Admin_1.assignSubRegionAdmin)(foundAdmin._id.toString(), areas);
        const assignAdminToSubRegion = await (0, Admin_1.assignSubRegionAdminToSubRegion)(foundAdmin, areas);
        return res.json({
            status: "Success",
            message: "admin assign successfuly",
            data: assignAdmin
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.assignSubRegionAdminToSubRegionController = assignSubRegionAdminToSubRegionController;
const getAllSubRegion = async (req, res) => {
    try {
        const user = req.user;
        const foundArea = await (0, Admin_1.getAllMySubRegion)(user._id.toString());
        return res.json({
            status: "Success",
            message: "foundAllRegion",
            data: foundArea
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getAllSubRegion = getAllSubRegion;
const setAdminConfigController = async (req, res) => {
    try {
        const { defaultPenaltyFee, firstTimeAdminFee, loanPenaltyFee, fixedSavingsAnualInterest, fixedSavingsPenaltyFee, terminalBonus } = req.body;
        const config = await (0, Admin_1.setAdminSavingsConfig)(defaultPenaltyFee, firstTimeAdminFee, loanPenaltyFee, fixedSavingsAnualInterest, fixedSavingsPenaltyFee, terminalBonus);
        if (!config) {
            return res.json({
                status: "Failed",
                message: "something went wrong",
            });
        }
        return res.json({
            status: "Success",
            message: "record updated",
            data: config,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.setAdminConfigController = setAdminConfigController;
const getAdminConfigController = async (req, res) => {
    try {
        const configSettings = await (0, Admin_1.getAdminSavingsConfig)();
        return res.json({
            status: "Success",
            message: "config setting",
            data: configSettings,
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getAdminConfigController = getAdminConfigController;
// get all users 
const getAllUserController = async (req, res) => {
    try {
        const allUsers = await (0, User_1.getAllUser)();
        return res.json({
            status: "Success",
            message: "found Users",
            data: allUsers,
            numberOfUsers: allUsers.length
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getAllUserController = getAllUserController;
// get all admin
const getAllAdminController = async (req, res) => {
    try {
        const allAdmin = await (0, Admin_1.getAllAdmin)();
        return res.json({
            status: "Success",
            message: "found Admins",
            data: allAdmin,
            numberOfAdmin: allAdmin.length
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getAllAdminController = getAllAdminController;
// get admin by role
const getAllAdminByRoleController = async (req, res) => {
    try {
        const { role } = req.params;
        const allAdmin = await (0, Admin_1.getAdminByRole)(role);
        return res.json({
            status: "Success",
            message: "found Admins",
            data: allAdmin,
            numberOfAdmin: allAdmin.length
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getAllAdminByRoleController = getAllAdminByRoleController;
const getAdminDashboardDetails = async (req, res) => {
    try {
        const alltransaction = await (0, Admin_1.getAllTransaction)();
        let result = {
            totalWalletFund: 0,
            totalWithdrawal: 0,
            totalAirtimeAndData: 0
        };
        for (const transaction of alltransaction) {
            if (transaction.type === "deposit") {
                result.totalWalletFund += transaction.amount;
            }
            if (transaction.type === "withdrawal") {
                result.totalWithdrawal += transaction.amount;
            }
            if (transaction.type === "airtime") {
                result.totalAirtimeAndData += transaction.amount;
            }
            if (transaction.type === "data") {
                result.totalAirtimeAndData += transaction.amount;
            }
        }
        return res.json({
            status: "Success",
            message: "details calculated successfuly",
            data: result
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getAdminDashboardDetails = getAdminDashboardDetails;
const getSavingsDetailsController = async (req, res) => {
    try {
        const savingsDetails = await (0, Savings_1.getSavingsDetails)();
        return res.json({
            status: "Success",
            message: "savings details calculated",
            data: savingsDetails
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getSavingsDetailsController = getSavingsDetailsController;
const getUserSavingsDetailsController = async (req, res) => {
    try {
        const foundRecord = await (0, Savings_1.getAllUserSavingsRecord)();
        return res.json({
            status: "Success",
            message: "found Record",
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
exports.getUserSavingsDetailsController = getUserSavingsDetailsController;
// get all loan record
const getAllLoanRecordController = async (req, res) => {
    try {
        const foundRecord = await (0, Loan_1.getAllLoanRecord)();
        return res.json({
            status: "Success",
            message: "found Record",
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
exports.getAllLoanRecordController = getAllLoanRecordController;
// get  loan record by status
const getLoanRecordByStatusController = async (req, res) => {
    try {
        const { status } = req.body;
        const foundRecords = await (0, Loan_1.getLoanRecordByStatus)(status);
        return res.json({
            status: "Success",
            message: "found record",
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
exports.getLoanRecordByStatusController = getLoanRecordByStatusController;
// aprovve pending loan
const approveOrRejectLoanController = async (req, res) => {
    try {
        const { id, status, duration } = req.body;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + duration);
        const record = await (0, Loan_1.approveOrRejectLoan)(id, status, duration, dueDate);
        return res.json({
            status: "Success",
            message: "record updated",
            data: record
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.approveOrRejectLoanController = approveOrRejectLoanController;
const getAllAdminSavingsController = async (req, res) => {
    try {
        const foundRecord = await (0, Savings_1.getAllSavingsCircle)();
        return res.json({
            status: "Success",
            message: "found record",
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
exports.getAllAdminSavingsController = getAllAdminSavingsController;
// edit pending loan for approval
// send general notification
// send personal notification
// suspend admin account
