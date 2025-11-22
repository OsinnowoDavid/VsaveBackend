"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSavingsCircleSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", // Reference to your User model
        required: true,
    },
    savingsTitle: {
        type: String,
    },
    frequency: {
        type: String,
        enum: ["DAILY", "WEEKLY", "MONTHLY"],
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    deductionPeriod: {
        type: String,
    },
    savingsAmount: { type: Number, required: true },
    circleId: { type: String },
    maturityAmount: { type: Number },
}, { timestamps: true });
const userSavingsCircle = mongoose_1.default.model("User_savings_circle", userSavingsCircleSchema);
exports.default = userSavingsCircle;
