import express from "express";
import { verifySubRegionalAdminToken } from "../config/JWT";
import { login, createAgentController } from "../controller/SubRegionalAdmin";

const router = express.Router();

router.post("/login", login);

router.post(
    "/create-agent",
    verifySubRegionalAdminToken,
    createAgentController,
);

export default router;
