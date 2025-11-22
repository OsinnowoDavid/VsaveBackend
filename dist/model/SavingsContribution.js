"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const savingsContributionSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", // Reference to your User model
        required: true,
    },
    savingsRecordId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User_savings_record", // Reference to your user savings record model
        required: true,
    },
    adminFirstTimeFee: {
        type: Number,
        default: 0,
    },
    record: [
        {
            periodIndex: Number,
            amount: Number,
            status: {
                type: String,
                enum: ["pending", "paid"],
            },
        },
    ],
    currentAmountSaved: { type: Number, default: 0 },
}, { timestamps: true });
const savingsContribution = mongoose_1.default.model("Savings_contribution", savingsContributionSchema);
exports.default = savingsContribution;
