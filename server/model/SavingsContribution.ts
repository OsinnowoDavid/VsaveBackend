import mongoose from "mongoose";

const savingsContributionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to your User model
            required: true,
        },
        savingsRecordId: {
            type: mongoose.Schema.Types.ObjectId,
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
    },
    { timestamps: true },
);

const savingsContribution = mongoose.model(
    "Savings_contribution",
    savingsContributionSchema,
);

export default savingsContribution;
