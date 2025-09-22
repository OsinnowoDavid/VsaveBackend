import express from "express";
import { verifyRegionalAdminToken } from "../config/JWT";
import {
  LoginRegionalAdmin,
  regionalAdminProfile,
} from "../controller/regionalAdmin";

const router = express.Router();

router.post("/login", LoginRegionalAdmin);

router.get("/profile", verifyRegionalAdminToken, regionalAdminProfile);

export default router;
