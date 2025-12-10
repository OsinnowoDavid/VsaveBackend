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
        savingsAmount: { type: Number, required: true },
        circleId: { type: String },
        maturityAmount: { type: Number },
    },
    { timestamps: true },
);

const userSavingsCircle = mongoose.model(
    "User_savings_circle",
    userSavingsCircleSchema,
);

export default userSavingsCircle;
