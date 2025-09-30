"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const webhookSchema = new mongoose_1.default.Schema({
    provider: {
        type: String,
        enum: ["squad", "paystack", "flutterwave", "other"],
        default: "squad",
    },
    eventType: {
        type: String,
        trim: true, // e.g., "virtual_account.credit", "dynamic_va.expired"
    },
    transactionReference: {
        type: String,
        index: true,
    },
    virtualAccountNumber: {
        type: String,
        index: true,
    },
    amount: {
        type: Number,
    },
    currency: {
        type: String,
        default: "NGN",
    },
    status: {
        type: String,
        enum: ["pending", "processed", "failed"],
        default: "pending",
    },
    rawPayload: {
        type: Object, // full JSON body from Squad
        required: true,
    },
    signature: {
        type: String, // x-squad-signature header (HMAC hash)
    },
    processedAt: {
        type: Date,
    },
    error: {
        type: String, // if processing failed, store reason
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Webhook", webhookSchema);
