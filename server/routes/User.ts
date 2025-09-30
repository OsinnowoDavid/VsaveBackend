import express from "express";
import {
  registerUser,
  loginUser,
  userProfile,
  verifyEmail,
  resendUserVerificationEmail,
  registerKYC1,
  getBanksAndCode,
  // verifyBankAccountController,
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
router.get("/get-all-banks", verifyUserToken, getBanksAndCode);
// router.post(
//   "/verify-bank-account",
//   verifyUserToken,
//   verifyBankAccountController
// );
router.get("/register-kyc1", verifyUserToken, registerKYC1);
export default router;
