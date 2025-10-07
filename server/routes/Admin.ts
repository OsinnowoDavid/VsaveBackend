import express from "express";
import {
  registerAdminController,
  LoginSuperAdminController,
  superAdminProfileController,
  createNewRegionController,
  createRegionalAdminController
} from "../controller/Admin";
import { verifySuperAdminToken } from "../config/JWT";
import { validateAdminRegistrationInput } from "../validate-input/admin";

const router = express.Router();

router.post(
  "/register",
  validateAdminRegistrationInput,
  registerAdminController
); 

router.post("/login", LoginSuperAdminController);

router.get("/profile", verifySuperAdminToken, superAdminProfileController);

router.post("/create-region", verifySuperAdminToken, createNewRegionController); 

router.post("/create-regional-admin", verifySuperAdminToken, createRegionalAdminController)

export default router;
