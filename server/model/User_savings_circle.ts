import mongoose from "mongoose";

const userSavingsCircleSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to your User model
            required: true,
        },
        savingsTitle: {
            type: String,
        },
        frequency: {
            type: String,
            enum: ["DAILY", "WEEKLY", "MONTHLY"],
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        deductionPeriod: {
            type: String,
        },
        firstTimeAdminFee: { type: String },
        savingsAmount: { type: Number, required: true },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date },
        circleIndex: { type: Number, default: 1 },
        status: {
            type: String,
            enum: ["ACTIVE", "PAUSED", "ENDED"],
            default: "ACTIVE",
        },
        autoRestartEnabled: { type: Boolean, default: false },
        maturityAmount: { type: Number },
    },
    { timestamps: true },
);

const userSavingsCircle = mongoose.model(
    "User_savings_circle",
    userSavingsCircleSchema,
);

export default userSavingsCircle;
