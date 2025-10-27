import express from "express";
import { verifySubRegionalAdminToken } from "../config/JWT";
import { createSavingPlanController } from "../controller/Savings";

const router = express.Router();

router.post(
    "/create-savingsplan",
    verifySubRegionalAdminToken,
    createSavingPlanController,
);

export default router;
