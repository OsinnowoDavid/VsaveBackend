import express from "express";
import { verifyRegionalAdminToken } from "../config/JWT";
import {
    LoginRegionalAdmin,
    regionalAdminProfile,
    createSubRegionController,
    createSubRegionalAdmincontroller,
    getAllSubRegionController,
} from "../controller/regionalAdmin";

const router = express.Router();

router.post("/login", LoginRegionalAdmin);

router.get("/profile", verifyRegionalAdminToken, regionalAdminProfile);

router.post(
    "/create-subregion",
    verifyRegionalAdminToken,
    createSubRegionController,
);

router.post(
    "/create-subregion-admin",
    verifyRegionalAdminToken,
    createSubRegionalAdmincontroller,
);

router.get(
    "/get-all-subregion",
    verifyRegionalAdminToken,
    getAllSubRegionController,
);

export default router;
