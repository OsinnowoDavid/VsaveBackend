"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminConfigSchema = new mongoose_1.default.Schema({
    defaultPenaltyFee: {
        type: String,
    },
    firstTimeAdminFee: {
        type: String,
    },
});
const adminConfig = mongoose_1.default.model("Admin_config", adminConfigSchema);
exports.default = adminConfig;
