"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const savingsSchema = new mongoose_1.default.Schema({
    subRegion: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Region",
        required: true,
    },
    frequency: {
        type: String,
        enum: ["DAILY", "WEEKLY", "MONTHLY"],
        required: true,
    },
    savingsAmount: { type: Number, required: true },
    noOfcircleIndex: { type: Number, default: 1 },
    firstTimeAdminFee: { type: String },
    autoRestartEnabled: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["ACTIVE", "PAUSED", "ENDED"],
        default: "ACTIVE",
    },
    adminId: {
        type: String,
    },
});
const savings = mongoose_1.default.model("Savings", savingsSchema);
exports.default = savings;
