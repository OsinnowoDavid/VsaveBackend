import express from "express";
import {
  registerUser,
  loginUser,
  userProfile,
  verifyEmail,
  resendUserVerificationEmail,
  registerKYC1,
} from "../controller/User";
import {
  validateUserRegitrationInput,
  validateUserKYC1Input,
  validateUserLoginInput,
} from "../validate-input/user/index";
import { verifyUserToken } from "../config/JWT";
const router = express.Router();

router.post("/register", validateUserRegitrationInput, registerUser);
router.post("/login", validateUserLoginInput, loginUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-token", resendUserVerificationEmail);
router.get("/profile", verifyUserToken, userProfile);
router.get(
  "/register-kyc1",
  verifyUserToken,
  validateUserKYC1Input,
  registerKYC1
);

export default router;
