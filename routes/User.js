"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../controller/User");
const JWT_1 = require("../config/JWT");
const router = express_1.default.Router();
router.post("/register", User_1.registerUser);
router.post("/login", User_1.loginUser);
router.post("/verify-email", User_1.verifyEmail);
router.post("/resend-verification-token", User_1.resendUserVerificationEmail);
router.get("/profile", JWT_1.verifyUserToken, User_1.userProfile);
router.get("/register-kyc1", JWT_1.verifyUserToken, User_1.registerKYC1);
exports.default = router;
