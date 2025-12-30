"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Admin_1 = require("../controller/Admin");
const JWT_1 = require("../config/JWT");
const index_1 = require("../validate-input/admin/index");
const router = express_1.default.Router();
router.post("/register", index_1.validateAdminRegistrationInput, Admin_1.registerAdminController);
router.post("/login", Admin_1.LoginSuperAdminController);
router.get("/profile", JWT_1.verifySuperAdminToken, Admin_1.superAdminProfileController);
// get index info
router.post("/create-region", JWT_1.verifySuperAdminToken, Admin_1.createNewRegionController);
router.post("/create-regional-admin", JWT_1.verifySuperAdminToken, Admin_1.createRegionalAdminController);
router.post("/assign-regionaladmin-to-region", JWT_1.verifySuperAdminToken, Admin_1.assignRegionalAdminToRegionController);
router.get("/get-all-regional-admin", JWT_1.verifySuperAdminToken, Admin_1.getAllRegionalAdminController);
router.get("/get-all-region", JWT_1.verifySuperAdminToken, Admin_1.getAllRegionController);
router.get("/get-regional-admin/:email", JWT_1.verifySuperAdminToken, Admin_1.getRegionalAdminByEmailController);
router.post("/set-saving-config", JWT_1.verifySuperAdminToken, Admin_1.setAdminConfigController);
router.get("/get-savings-config", JWT_1.verifySuperAdminToken, Admin_1.getAdminConfigController);
// get all loan record
// get  loan record by status
// aprovve pending loan
// send general notification
// send personal notification
// suspend admin account
exports.default = router;
