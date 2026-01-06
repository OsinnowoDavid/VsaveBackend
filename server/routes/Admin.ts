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
    getAdminConfigController,
    assignRegionalAdminToRegionController,
    createAdminPasswordController
} from "../controller/Admin";
import { verifySuperAdminToken } from "../config/JWT";
import { validateAdminRegistrationInput } from "../validate-input/admin/index";

const router = express.Router();

router.post(
    "/register",
    validateAdminRegistrationInput,
    registerAdminController,
);
router.post("/create-password", createAdminPasswordController)
router.post("/login", LoginSuperAdminController);

router.get("/profile", verifySuperAdminToken, superAdminProfileController);
// get index info
router.post("/create-region", verifySuperAdminToken, createNewRegionController);

router.post(
    "/create-regional-admin",
    verifySuperAdminToken,
    createRegionalAdminController,
);

router.post("/assign-regionaladmin-to-region", verifySuperAdminToken,assignRegionalAdminToRegionController)

router.get(
    "/get-all-regional-admin",
    verifySuperAdminToken,
    getAllRegionalAdminController,
);

router.get("/get-all-region", verifySuperAdminToken, getAllRegionController);

router.get(
    "/get-regional-admin/:email",
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
    getAdminConfigController,
);
// get all loan record
// get  loan record by status
// aprovve pending loan
// send general notification
// send personal notification
// suspend admin account
export default router;
