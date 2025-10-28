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
    savingsId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Savings", // Reference to your User model
        required: true,
    },
    savingsCircleId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Savings_circle", // Reference to your User model
        required: true,
    },
    records: [
        {
            period: String,
            periodIndex: String,
            amount: Number,
            status: {
                type: String,
                enum: ["pending", "paid"],
            },
        },
    ],
    status: {
        type: String,
        enum: ["ACTIVE", "PAUSED", "ENDED"],
        default: "ACTIVE",
    },
    maturityAmount: {
        type: Number,
    },
    payOut: {
        type: Number,
    },
}, { timestamps: true });
const userSavingsRecord = mongoose_1.default.model("User_savings_record", userSavingsRecordSchema);
exports.default = userSavingsRecord;
