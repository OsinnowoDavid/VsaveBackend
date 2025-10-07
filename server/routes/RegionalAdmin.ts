import express from "express";
import { verifyRegionalAdminToken } from "../config/JWT";
import {
  LoginRegionalAdmin,
  regionalAdminProfile,
  createSubRegionController,
  createSubRegionalAdmincontroller,
} from "../controller/regionalAdmin";

const router = express.Router();

router.post("/login", LoginRegionalAdmin);

router.get("/profile", verifyRegionalAdminToken, regionalAdminProfile);

router.post("/create-subregion", createSubRegionController);

router.post("/create-subregion-admin", createSubRegionalAdmincontroller);

export default router;
