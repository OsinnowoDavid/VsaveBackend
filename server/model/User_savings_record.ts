import mongoose from "mongoose";

const userSavingsRecordSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to your User model
            required: true,
        },
        savingsCircleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Savings_circle", // Reference to your  savings_circle model
            required: true,
        },
        period: { type: Number, default: 0 },
        duration: { type: Number },
        startDate: { type: Date },
        endDate: { type: Date },
        contributionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Savings_contribution", // Reference to your contribution model
            required: false,
        },
        payOutDate: { type: Date },
        status: {
            type: String,
            enum: ["ACTIVE", "PAUSED", "ENDED", "PENDING"],
            default: "ACTIVE",
        },
        maturityAmount: {
            type: Number,
        },
        payOutStatus: {
            type: Boolean,
            default: false,
        },
        autoRestartEnabled: { type: Boolean, default: false },
    },
    { timestamps: true },
);

const userSavingsRecord = mongoose.model(
    "User_savings_record",
    userSavingsRecordSchema,
);

export default userSavingsRecord;
