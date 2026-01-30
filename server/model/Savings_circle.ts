import mongoose from "mongoose";

const savingsCircleSchema = new mongoose.Schema(
    {
        savingsTitle: { type: String },
        region: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Region",
            required: true,
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
        status: {
            type: String,
            enum: ["ACTIVE", "PAUSED", "ENDED"],
            default: "ACTIVE",
        },
        maturityAmount: { type: Number },
        adminId: {
            type: String,
        },
    },
    { timestamps: true },
);

const savingsCircle = mongoose.model("Savings_circle", savingsCircleSchema);
export default savingsCircle;
