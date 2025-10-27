"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWT_1 = require("../config/JWT");
const Savings_1 = require("../controller/Savings");
const router = express_1.default.Router();
router.post("/create-savingsplan", JWT_1.verifySubRegionalAdminToken, Savings_1.createSavingPlanController);
exports.default = router;
