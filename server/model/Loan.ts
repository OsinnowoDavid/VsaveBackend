import mongoose from "mongoose";

const Schema = mongoose.Schema;

const loanSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        amount: { type: Number, required: true },
        interest: { type: Number },
        interestPercentage: { type: Number },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "completed"],
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
        isSettled: {
            type: Boolean,
            default: false,
        },
        repaymentCompletedDate: { type: Date },
    },
    { timestamps: true },
);

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
