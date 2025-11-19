"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWT_1 = require("../config/JWT");
const Loan_1 = require("../controller/Loan");
const router = express_1.default.Router();
router.get("/check-elegibility", JWT_1.verifyUserToken, Loan_1.checkElegibilityController);
router.post("/loan-payout", JWT_1.verifyUserToken, Loan_1.createLoanController);
router.get("/all-loan-record", JWT_1.verifyUserToken, Loan_1.allUserLoanRecord);
router.get("/settled-loan", JWT_1.verifyUserToken, Loan_1.allUserSettledLoanRecord);
router.get("/unsettled-loan", JWT_1.verifyUserToken, Loan_1.allUserUnsettledLoanRecord);
exports.default = router;
