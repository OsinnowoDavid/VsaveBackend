"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../controller/User");
const user_1 = require("../validate-input/user");
const JWT_1 = require("../config/JWT");
const router = express_1.default.Router();
router.post("/register", user_1.validateUserRegitrationInput, User_1.registerUser);
router.post("/login", user_1.validateUserLoginInput, User_1.loginUser);
router.post("/verify-email", User_1.verifyEmail);
router.post("/resend-verification-token", User_1.resendUserVerificationEmail);
router.get("/profile", JWT_1.verifyUserToken, User_1.userProfile);
// router.post(
//   "/verify-bank-account",
//   verifyUserToken,
//   verifyBankAccountController
// );
router.get("/register-kyc1", JWT_1.verifyUserToken, User_1.registerKYC1);
router.get("/get-data-plan/:network", JWT_1.verifyUserToken, User_1.getDataPlanController);
router.post("/buy-airtime", JWT_1.verifyUserToken, User_1.buyAirtimeController);
router.post("/buy-data", JWT_1.verifyUserToken, User_1.buyDataController);
router.get("/get-bank-code", JWT_1.verifyUserToken, User_1.getBankCodeController);
router.post("/account-lookup", JWT_1.verifyUserToken, User_1.accountLookUpController);
router.post("/payout", JWT_1.verifyUserToken, User_1.payOutController);
exports.default = router;
