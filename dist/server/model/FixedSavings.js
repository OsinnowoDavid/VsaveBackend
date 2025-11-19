"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fixedSavingsSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: "NG",
    },
    interestPayoutType: {
        type: String,
        enum: ["MATURITY", "UPFRONT"],
        required: true,
    },
    interestRate: {
        type: String,
    },
    interestAmount: {
        type: Number,
    },
    paymentAmount: {
        type: Number,
    },
    duration: { type: String },
    durationIndex: { type: Number },
    startDate: { type: Date },
    endDate: { type: String },
    status: {
        type: String,
        enum: ["pending", "rejected", "active", "completed"],
    },
}, { timestamps: true });
const fixedSavings = mongoose_1.default.model("fixed_savings", fixedSavingsSchema);
exports.default = fixedSavings;
