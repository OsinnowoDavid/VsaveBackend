import express from "express";
import { verifyUserToken } from "../config/JWT";
import {
    checkElegibilityController,
    createLoanController,
} from "../controller/Loan";
const router = express.Router();

router.get("/check-elegibility", verifyUserToken, checkElegibilityController);

router.post("/get-loan", verifyUserToken, createLoanController);

export default router;
