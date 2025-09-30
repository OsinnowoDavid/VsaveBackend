"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../controller/User");
const index_1 = require("../validate-input/user/index");
const JWT_1 = require("../config/JWT");
const router = express_1.default.Router();
router.post("/register", index_1.validateUserRegitrationInput, User_1.registerUser);
router.post("/login", index_1.validateUserLoginInput, User_1.loginUser);
router.post("/verify-email", User_1.verifyEmail);
router.post("/resend-verification-token", User_1.resendUserVerificationEmail);
router.get("/profile", JWT_1.verifyUserToken, User_1.userProfile);
router.get("/get-all-banks", JWT_1.verifyUserToken, User_1.getBanksAndCode);
// router.post(
//   "/verify-bank-account",
//   verifyUserToken,
//   verifyBankAccountController
// );
router.get("/register-kyc1", JWT_1.verifyUserToken, User_1.registerKYC1);
exports.default = router;
