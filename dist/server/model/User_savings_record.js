"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSavingsRecordSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", // Reference to your User model
        required: true,
    },
    savingsCircleId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Savings_circle", // Reference to your  savings_circle model
        required: true,
    },
    adminFirstTimeFee: {
        type: Number,
        default: 0,
    },
    period: { type: Number, default: 0 },
    duration: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    contributionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Savings_contribution", // Reference to your contribution model
        required: false,
    },
    payOutDate: { type: Date },
    status: {
        type: String,
        enum: ["ACTIVE", "PAUSED", "ENDED", "PENDING"],
        default: "ACTIVE",
    },
    maturityAmount: {
        type: Number,
    },
    payOutStatus: {
        type: Boolean,
        default: false,
    },
    autoRestartEnabled: { type: Boolean, default: false },
}, { timestamps: true });
const userSavingsRecord = mongoose_1.default.model("User_savings_record", userSavingsRecordSchema);
exports.default = userSavingsRecord;
