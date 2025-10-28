import mongoose from "mongoose";

const fixedSavingsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "NG",
        },
        interestRate: {
            type: String,
        },
        paymentAmount: {
            type: Number,
        },
        duration: { type: String },
        durationIndex: { type: Number },
        startDate: { type: Date },
        endDate: { type: String },
        status: {
            type: String,
            enum: ["pending", "rejected", "active", "completed"],
        },
    },
    { timestamps: true },
);

const fixedSavings = mongoose.model("fixed_savings", fixedSavingsSchema);

export default fixedSavings;
