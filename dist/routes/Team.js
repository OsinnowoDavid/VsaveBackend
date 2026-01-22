"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Area_1 = require("../controller/Area");
const router = express_1.default.Router();
router.post("/create-password", Area_1.createPasswordController);
exports.default = router;
