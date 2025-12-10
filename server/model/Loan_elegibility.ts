import mongoose from "mongoose";

const loanElegibilitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    stage: { type: Number, default: 1 },
    payedLastLoan: { type: String },
    elegibility: { type: Boolean, default: false },
    lastLoanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan",
    },
    elegibilityAmount: { type: Number, default: 0 },
    interestRate: { type: String, default: "1.2" },
    status:{type:String,enum:["no rating", "beginner", "good", "excellent"]}
});

const loanElegibility = mongoose.model(
    "Loan_elegibility",
    loanElegibilitySchema,
);

export default loanElegibility;
