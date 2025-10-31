"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const savingsCircleSchema = new mongoose_1.default.Schema({
    savingsPlanId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Savings",
        required: true,
    },
    savingsTitle: { type: String },
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
    duration: {
        type: Number,
        required: true,
    },
    deductionPeriod: {
        type: String,
    },
    savingsAmount: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    circleIndex: { type: Number, default: 1 },
    status: {
        type: String,
        enum: ["ACTIVE", "PAUSED", "ENDED"],
        default: "ACTIVE",
    },
    maturityAmount: { type: Number },
}, { timestamps: true });
const savingsCircle = mongoose_1.default.model("Savings_circle", savingsCircleSchema);
exports.default = savingsCircle;
