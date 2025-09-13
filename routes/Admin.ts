import express from "express";
import {
  registerAdmin,
  LoginSuperAdmin,
  superAdminProfile,
} from "../controller/Admin";
import { verifySuperadminToken } from "../config/JWT";

const router = express.Router();

router.post("/register", registerAdmin);

router.post("/login", LoginSuperAdmin);

router.get("/profile", verifySuperadminToken, superAdminProfile);

export default router;
