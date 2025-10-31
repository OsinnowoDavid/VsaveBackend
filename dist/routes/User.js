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
router.get("/kyc1", JWT_1.verifyUserToken, User_1.getUserKyc1RecordController);
router.get("/get-data-plan/:network", JWT_1.verifyUserToken, User_1.getDataPlanController);
router.post("/buy-airtime", JWT_1.verifyUserToken, User_1.buyAirtimeController);
router.post("/buy-data", JWT_1.verifyUserToken, User_1.buyDataController);
router.get("/get-bank-code", JWT_1.verifyUserToken, User_1.getBankCodeController);
router.post("/account-lookup", JWT_1.verifyUserToken, User_1.accountLookUpController);
router.post("/payout", JWT_1.verifyUserToken, User_1.payOutController);
router.get("/transactions", JWT_1.verifyUserToken, User_1.getUserTransactionsController);
router.get("/single-transaction/:id", JWT_1.verifyUserToken, User_1.getUserSingleTransactionController);
router.get("/transaction-by-status/:status", JWT_1.verifyUserToken, User_1.getUserTransactionByStatusController);
router.get("/transaction-by-type/:type", JWT_1.verifyUserToken, User_1.getUserTransactionByTypeController);
router.get("/subregions", JWT_1.verifyUserToken, User_1.userGetAllSubRegionController);
router.post("/join-savings", JWT_1.verifyUserToken, User_1.joinSavingsController);
router.get("/avaliable-savings", JWT_1.verifyUserToken, User_1.getAvaliableSavingsController);
router.get("/active-savings", JWT_1.verifyUserToken, User_1.getUserActiveSavingsController);
router.get("/all-savings-record", JWT_1.verifyUserToken, User_1.getUserSavingsRecordsController);
exports.default = router;
