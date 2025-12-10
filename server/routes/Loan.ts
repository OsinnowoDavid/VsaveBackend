import express from "express";
import { verifyUserToken } from "../config/JWT";
import {
    checkElegibilityController,
    createLoanController,
    allUserLoanRecord,
    allUserSettledLoanRecord,
    allUserUnsettledLoanRecord,
} from "../controller/Loan";
const router = express.Router();

router.get("/check-elegibility", verifyUserToken, checkElegibilityController);

router.post("/loan-payout", verifyUserToken, createLoanController);

router.get("/all-loan-record", verifyUserToken, allUserLoanRecord);

router.get("/settled-loan", verifyUserToken, allUserSettledLoanRecord);

router.get("/unsettled-loan", verifyUserToken, allUserUnsettledLoanRecord);

export default router;
