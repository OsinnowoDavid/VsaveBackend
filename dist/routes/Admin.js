"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Admin_1 = require("../controller/Admin");
const JWT_1 = require("../config/JWT");
const Loan_1 = require("../controller/Loan");
const router = express_1.default.Router();
router.post("/register", JWT_1.verifySuperAdminToken, Admin_1.registerAdminController);
router.post("/create-password", Admin_1.createAdminPasswordController);
router.post("/resend-verification-code", Admin_1.resendVerificationCodeController);
router.post("/login", Admin_1.LoginAdminController);
router.get("/profile", JWT_1.verifySuperAdminToken, Admin_1.superAdminProfileController);
// get index info
router.post("/create-region", JWT_1.verifySuperAdminToken, Admin_1.createNewRegionController);
router.post("/assign-regionaladmin-to-region", JWT_1.verifySuperAdminToken, Admin_1.assignRegionalAdminToRegionController);
router.get("/get-all-regional-admin", JWT_1.verifySuperAdminToken, Admin_1.getAllRegionalAdminController);
router.get("/get-all-region", JWT_1.verifySuperAdminToken, Admin_1.getAllRegionController);
router.get("/get-regional-admin/:email", JWT_1.verifySuperAdminToken, Admin_1.getRegionalAdminByEmailController);
router.post("/create-area", JWT_1.verifyRegionalAdminToken, Admin_1.createTeamController);
router.post("/assign-admin-to-area", JWT_1.verifyRegionalAdminToken, Admin_1.assignTeamAdminToTeamController);
router.get("/get-all-team", JWT_1.verifySubRegionalAdminToken, Admin_1.getAllMyTeamController);
router.get("/get-all-team-by-region/:region", JWT_1.verifySuperAdminToken, Admin_1.getTeamByRegionController);
router.post("/set-saving-config", JWT_1.verifySuperAdminToken, Admin_1.setAdminConfigController);
router.get("/get-savings-config", JWT_1.verifySuperAdminToken, Admin_1.getAdminConfigController);
// get all User 
router.get("/get-all-user", JWT_1.verifySuperAdminToken, Admin_1.getAllUserController);
// get all admin 
router.get("/get-all-admin", JWT_1.verifySuperAdminToken, Admin_1.getAllAdminController);
// get admin by role 
router.get("/get-admin/:role", JWT_1.verifySuperAdminToken, Admin_1.getAllAdminByRoleController);
router.get("/get-dashboardDetails", JWT_1.verifySuperAdminToken, Admin_1.getAdminDashboardDetails);
// get all user savings (calculated) 
router.get("/user-savings-calculation", JWT_1.verifySuperAdminToken, Admin_1.getSavingsDetailsController);
router.get("/user-savings-record", JWT_1.verifySuperAdminToken, Admin_1.getUserSavingsDetailsController);
router.post("/update", JWT_1.verifyGeneralAdminToken, Admin_1.updateAdminRecordController);
router.post("/update-password", JWT_1.verifyGeneralAdminToken, Admin_1.updateAdminPasswordController);
router.delete("/:id", JWT_1.verifySuperAdminToken, Admin_1.deleteAminController);
// get all loan record
router.get("/get-all-loan", JWT_1.verifySuperAdminToken, Admin_1.getAllLoanRecordController);
// get  loan record by status
router.get("/get-loan-by-status", JWT_1.verifySuperAdminToken, Admin_1.getLoanRecordByStatusController);
// aprovve pending loan 
router.post("/approve-pending-loan", JWT_1.verifySuperAdminToken, Loan_1.approveOrRejectLoanController);
router.post("/edit-loan-for-approval", JWT_1.verifySuperAdminToken, Loan_1.editLoanForApprovalController);
router.get("/all-admin-created-savings", JWT_1.verifySuperAdminToken, Admin_1.getAllAdminSavingsController);
router.post("/create-agent", JWT_1.verifySubRegionalAdminToken, Admin_1.createAgentsController);
router.get("/get-all-agent", JWT_1.verifySuperAdminToken, Admin_1.getAllAgentsController);
// send general notification
// send personal notification
// suspend admin account
// create Officer 
exports.default = router;
