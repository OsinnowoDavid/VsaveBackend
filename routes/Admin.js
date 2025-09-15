"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Admin_1 = require("../controller/Admin");
const JWT_1 = require("../config/JWT");
const router = express_1.default.Router();
router.post("/register", Admin_1.registerAdmin);
router.post("/login", Admin_1.LoginSuperAdmin);
router.get("/profile", JWT_1.verifySuperAdminToken, Admin_1.superAdminProfile);
exports.default = router;
