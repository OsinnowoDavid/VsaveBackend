import express from "express";
import {
  registerAdmin,
  LoginSuperAdmin,
  superAdminProfile,
} from "../controller/Admin";
import { verifySuperAdminToken } from "../config/JWT";

const router = express.Router();

router.post("/register", registerAdmin);

router.post("/login", LoginSuperAdmin);

router.get("/profile", verifySuperAdminToken, superAdminProfile);

export default router;
