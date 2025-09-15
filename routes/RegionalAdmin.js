"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWT_1 = require("../config/JWT");
const regionalAdmin_1 = require("../controller/regionalAdmin");
const router = express_1.default.Router();
router.post("/register", regionalAdmin_1.registerRegionalAdmin);
router.post("/login", regionalAdmin_1.LoginRegionalAdmin);
router.get("/profile", JWT_1.verifyRegionalAdminToken, regionalAdmin_1.regionalAdminProfile);
exports.default = router;
