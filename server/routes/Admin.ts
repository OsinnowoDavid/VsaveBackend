import express from "express";
import {
    registerAdminController,
    LoginAdminController,
    superAdminProfileController,
    createNewRegionController,
    getAllRegionController,
    getAllRegionalAdminController,
    getRegionalAdminByEmailController,
    setAdminConfigController,
    getAdminConfigController,
    assignRegionalAdminToRegionController,
    createAdminPasswordController,
    resendVerificationCodeController,
    getAllAdminController,
    getAllUserController,
    getAllAdminByRoleController,
    getAdminDashboardDetails,
    getSavingsDetailsController,
    getUserSavingsDetailsController,
    updateAdminRecordController,
    updateAdminPasswordController,
    getAllLoanRecordController,
    getLoanRecordByStatusController,
    approveOrRejectLoanController,
    getAllAdminSavingsController,
    deleteAminController,
    createTeamController,
   assignTeamAdminToTeamController,
   getAllMyTeamController,
   createAgentsController,
   getTeamByRegionController,
   getAllAgentsController
} from "../controller/Admin";
import { verifyGeneralAdminToken, verifySuperAdminToken , verifyRegionalAdminToken, verifySubRegionalAdminToken} from "../config/JWT"; 
import { validateAdminRegistrationInput } from "../validate-input/admin/index";

const router = express.Router();

router.post(
    "/register",
    verifySuperAdminToken,
    registerAdminController,
);
router.post("/create-password", createAdminPasswordController)
router.post("/resend-verification-code", resendVerificationCodeController)
router.post("/login", LoginAdminController);

router.get("/profile", verifySuperAdminToken, superAdminProfileController);
// get index info
router.post("/create-region", verifySuperAdminToken, createNewRegionController);


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
    "/create-area",
   verifyRegionalAdminToken,
    createTeamController,
);
router.post("/assign-admin-to-area",verifyRegionalAdminToken, assignTeamAdminToTeamController) ; 
router.get("/get-all-team", verifySubRegionalAdminToken,  getAllMyTeamController)
router.get("/get-all-team-by-region/:region", verifySuperAdminToken,getTeamByRegionController) ;
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
// get all User 
router.get("/get-all-user", verifySuperAdminToken, getAllUserController)
// get all admin 
router.get("/get-all-admin", verifySuperAdminToken, getAllAdminController) 
// get admin by role 
router.get("/get-admin/:role", verifySuperAdminToken, getAllAdminByRoleController) 
router.get("/get-dashboardDetails", verifySuperAdminToken, getAdminDashboardDetails) 
// get all user savings (calculated) 
router.get("/user-savings-calculation", verifySuperAdminToken, getSavingsDetailsController) 
router.get("/user-savings-record", verifySuperAdminToken, getUserSavingsDetailsController)
router.post("/update", verifyGeneralAdminToken, updateAdminRecordController) ; 
router.post("/update-password", verifyGeneralAdminToken,updateAdminPasswordController )
router.delete("/:id", verifySuperAdminToken, deleteAminController) ;
// get all loan record
router.get("/get-all-loan", verifySuperAdminToken, getAllLoanRecordController) 
// get  loan record by status
router.get("/get-loan-by-status", verifySuperAdminToken, getLoanRecordByStatusController,)
// aprovve pending loan 
router.post("/approve-pending-loan", verifySuperAdminToken, approveOrRejectLoanController)

router.get("/all-admin-created-savings", verifySuperAdminToken, getAllAdminSavingsController)

router.post("/create-agent", verifySubRegionalAdminToken, createAgentsController) 

router.get("/get-all-agent", verifySuperAdminToken, getAllAgentsController)
// send general notification
// send personal notification
// suspend admin account
// create Officer 
export default router;
