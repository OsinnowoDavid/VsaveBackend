import mongoose from "mongoose";

const Schema = mongoose.Schema;

const loanSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        InitialAmount: { type: Number, required: true },
        interest: { type: String },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "active", "completed"],
            default: "pending",
        },
        startDate: { type: Date },
        duration: { type: String },
        dueDate: { type: Date },
        repaymentAmount: { type: Number },
        repayments: [
            {
                amount: { type: Number, required: true },
                date: { type: Date, default: Date.now },
            },
        ],
        remark: {
            type: String,
        },
    },
    { timestamps: true },
);

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
