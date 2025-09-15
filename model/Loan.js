"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const loanSchema = new Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    InitAmount: { type: Number, required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "active", "completed"],
        default: "pending",
    },
    issueDate: { type: Date },
    dueDate: { type: Date },
    repayments: [
        {
            amount: { type: Number, required: true },
            date: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });
const Loan = mongoose_1.default.model("Loan", loanSchema);
exports.default = Loan;
