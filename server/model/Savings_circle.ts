import mongoose from "mongoose";

const savingsCircleSchema = new mongoose.Schema(
    {
        savingsPlanId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Savings",
            required: true,
        },
        frequency: {
            type: String,
            enum: ["DAILY", "WEEKLY", "MONTHLY"],
            required: true,
        },
        numberOfPeriod: {
            type: String,
        },
        savingAmount: { type: Number, required: true },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date },
        circleIndex: { type: Number, default: 1 },
        status: {
            type: String,
            enum: ["ACTIVE", "PAUSED", "ENDED"],
            default: "ACTIVE",
        },
    },
    { timestamps: true },
);

const savingsCircle = mongoose.model("Savings_circle", savingsCircleSchema);
export default savingsCircle;
