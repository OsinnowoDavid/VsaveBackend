import mongoose from "mongoose";

const Schema = mongoose.Schema;

const loanSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        InitialAmount: { type: Number, required: true },
        currentAmount: { type: Number, required: true },
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
    },
    { timestamps: true },
);

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
