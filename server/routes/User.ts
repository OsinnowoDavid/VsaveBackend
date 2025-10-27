import express from "express";
import {
    registerUser,
    loginUser,
    userProfile,
    verifyEmail,
    resendUserVerificationEmail,
    registerKYC1,
    // verifyBankAccountController,
    getDataPlanController,
    buyAirtimeController,
    buyDataController,
    getBankCodeController,
    accountLookUpController,
    payOutController,
    getUserKyc1RecordController,
    getUserTransactionsController,
    getUserSingleTransactionController,
    getUserTransactionByStatusController,
    getUserTransactionByTypeController,
} from "../controller/User";
import {
    validateUserRegitrationInput,
    validateUserKYC1Input,
    validateUserLoginInput,
} from "../validate-input/user";
import { verifyUserToken } from "../config/JWT";
const router = express.Router();

router.post("/register", validateUserRegitrationInput, registerUser);
router.post("/login", validateUserLoginInput, loginUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-token", resendUserVerificationEmail);
router.get("/profile", verifyUserToken, userProfile);
// router.post(
//   "/verify-bank-account",
//   verifyUserToken,
//   verifyBankAccountController
// );
router.get("/register-kyc1", verifyUserToken, registerKYC1);

router.get("/kyc1", verifyUserToken, getUserKyc1RecordController);

router.get("/get-data-plan/:network", verifyUserToken, getDataPlanController);

router.post("/buy-airtime", verifyUserToken, buyAirtimeController);

router.post("/buy-data", verifyUserToken, buyDataController);

router.get("/get-bank-code", verifyUserToken, getBankCodeController);

router.post("/account-lookup", verifyUserToken, accountLookUpController);

router.post("/payout", verifyUserToken, payOutController);

router.get("/transactions", verifyUserToken, getUserTransactionsController);

router.get(
    "/single-transaction/:id",
    verifyUserToken,
    getUserSingleTransactionController,
);

router.get(
    "/transaction-by-status/:status",
    verifyUserToken,
    getUserTransactionByStatusController,
);

router.get(
    "/transaction-by-type/:type",
    verifyUserToken,
    getUserTransactionByTypeController,
);

export default router;
