"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", // Reference to your User model
        required: true,
    },
    type: {
        type: String,
        enum: ["deposit", "withdrawal", "transfer", "airtime", "data"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    settledAmount: {
        type: Number,
        required: true,
    },
    feeCharged: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed", "reversed"],
        default: "pending",
    },
    reference: {
        type: String,
        unique: true, // useful for payment gateways like Paystack, Flutterwave
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    balanceBefore: {
        type: Number,
        required: false, // track balance before transaction
    },
    balanceAfter: {
        type: Number,
        required: false, // track balance after transaction
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Transaction", transactionSchema);
