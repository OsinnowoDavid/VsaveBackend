import express from "express";
import {
    registerAdminController,
    LoginSuperAdminController,
    superAdminProfileController,
    createNewRegionController,
    createRegionalAdminController,
    getAllRegionController,
    getAllRegionalAdminController,
    getRegionalAdminByEmailController,
    setAdminConfigController,
    getAdminSavingsConfigController,
} from "../controller/Admin";
import { verifySuperAdminToken } from "../config/JWT";
import { validateAdminRegistrationInput } from "../validate-input/admin/index";

const router = express.Router();

router.post(
    "/register",
    validateAdminRegistrationInput,
    registerAdminController,
);

router.post("/login", LoginSuperAdminController);

router.get("/profile", verifySuperAdminToken, superAdminProfileController);

router.post("/create-region", verifySuperAdminToken, createNewRegionController);

router.post(
    "/create-regional-admin",
    verifySuperAdminToken,
    createRegionalAdminController,
);

router.get(
    "/get-all-regional-admin",
    verifySuperAdminToken,
    getAllRegionalAdminController,
);

router.post("/get-all-region", verifySuperAdminToken, getAllRegionController);

router.get(
    "/get-regional-admin",
    verifySuperAdminToken,
    getRegionalAdminByEmailController,
);

router.post(
    "/set-saving-config",
    verifySuperAdminToken,
    setAdminConfigController,
);
router.get(
    "/get-savings-config",
    verifySuperAdminToken,
    getAdminSavingsConfigController,
);

export default router;
