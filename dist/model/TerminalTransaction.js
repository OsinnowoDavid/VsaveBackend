"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const terminalTransactionSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", // Reference to your User model
        required: true,
    },
    lottoryId: {
        type: String
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
    status: {
        type: String,
        enum: ["pending", "success", "failed", "reversed"],
        default: "pending",
    },
    transactionReference: {
        type: String,
        unique: true, // useful for payment gateways like Paystack, Flutterwave
        required: true,
    },
    remark: {
        type: String,
        trim: true,
    },
    from: {
        type: String,
    },
    date: {
        type: Date,
    },
});
const terminalTransaction = mongoose_1.default.model("terminalTransaction", terminalTransactionSchema);
exports.default = terminalTransaction;
