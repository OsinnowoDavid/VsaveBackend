import express from "express";
import { verifyRegionalAdminToken } from "../config/JWT";
import {
  registerRegionalAdmin,
  LoginRegionalAdmin,
  regionalAdminProfile,
} from "../controller/regionalAdmin";

const router = express.Router();

router.post("/register", registerRegionalAdmin);

router.post("/login", LoginRegionalAdmin);

router.get("/profile", verifyRegionalAdminToken, regionalAdminProfile);

export default router;
