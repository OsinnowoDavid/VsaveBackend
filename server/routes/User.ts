import express from "express";
import {
    registerUser,
    loginUser,
    userProfile,
    updateProfileController,
    changePasswordController,
    verifyEmail,
    resendUserVerificationEmail,
    registerKYC1,
    updateKYC1RecordController,
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
    userGetAllSubRegionController,
    joinSavingsController,
    createPersonalSavingsCircleController,
    getAvaliableSavingsController,
    getUserActiveSavingsRecordController,
    getAllUserSavingsRecordController,
    getSavingsCircleByIdController,
    createFixedSavingController,
    getActiveFixedSavingsController,
    getCompletedFixedSavingsController,
    getAllFixedSavingsController,
    validateTransactionPinController,
    updateTransactionPinController,
    createTransactionPinController,
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
router.post("/update-profile", verifyUserToken, updateProfileController);
router.post("/change-password", verifyUserToken, changePasswordController);
// router.post(
//   "/verify-bank-account",
//   verifyUserToken,
//   verifyBankAccountController
// );
router.post("/register-kyc1", verifyUserToken, registerKYC1);

router.post("/update-kyc1", verifyUserToken, updateKYC1RecordController);

router.get("/kyc1", verifyUserToken, getUserKyc1RecordController);

router.get("/get-data-plan/:network", verifyUserToken, getDataPlanController);

router.post(
    "/create-transaction-pin",
    verifyUserToken,
    createTransactionPinController,
);

router.post(
    "/validate-transaction-pin",
    verifyUserToken,
    validateTransactionPinController,
);

router.post(
    "/update-transaction-pin",
    verifyUserToken,
    updateTransactionPinController,
);

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

router.get("/subregions", verifyUserToken, userGetAllSubRegionController);

router.post("/join-savings", verifyUserToken, joinSavingsController);

router.post(
    "/create-personal-savings",
    verifyUserToken,
    createPersonalSavingsCircleController,
);

router.get(
    "/avaliable-savings-plan",
    verifyUserToken,
    getAvaliableSavingsController,
);

router.get(
    "/active-savings",
    verifyUserToken,
    getUserActiveSavingsRecordController,
);

router.get(
    "/all-savings-record",
    verifyUserToken,
    getAllUserSavingsRecordController,
);

router.get(
    "/get-savings-circle/:id",
    verifyUserToken,
    getSavingsCircleByIdController,
);
router.post(
    "/create-fixed-deposit",
    verifyUserToken,
    createFixedSavingController,
);
router.get(
    "/get-all-fixed-savings",
    verifyUserToken,
    getAllFixedSavingsController,
);
router.get(
    "/get-completed-fixed-savings",
    verifyUserToken,
    getCompletedFixedSavingsController,
);
router.get(
    "/get-active-fixed-savings",
    verifyUserToken,
    getActiveFixedSavingsController,
);
export default router;
