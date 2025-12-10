"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const loanElegibilitySchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    stage: { type: Number, default: 1 },
    payedLastLoan: { type: String },
    elegibility: { type: Boolean, default: false },
    lastLoanId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Loan",
    },
    elegibilityAmount: { type: Number, default: 0 },
    interestRate: { type: String, default: "1.2" },
    status: { type: String, enum: ["no rating", "beginner", "good", "excellent"] }
});
const loanElegibility = mongoose_1.default.model("Loan_elegibility", loanElegibilitySchema);
exports.default = loanElegibility;
