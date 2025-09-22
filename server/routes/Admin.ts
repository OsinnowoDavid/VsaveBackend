import express from "express";
import {
  registerAdminController,
  LoginSuperAdminController,
  superAdminProfileController,
} from "../controller/Admin";
import { verifySuperAdminToken } from "../config/JWT";

const router = express.Router();

router.post("/register", registerAdminController);

router.post("/login", LoginSuperAdminController);

router.get("/profile", verifySuperAdminToken, superAdminProfileController);

export default router;
