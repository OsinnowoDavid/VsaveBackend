"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWT_1 = require("../config/JWT");
const SubRegionalAdmin_1 = require("../controller/SubRegionalAdmin");
const router = express_1.default.Router();
router.post("/login", SubRegionalAdmin_1.login);
router.post("/create-agent", JWT_1.verifySubRegionalAdminToken, SubRegionalAdmin_1.createAgentController);
exports.default = router;
