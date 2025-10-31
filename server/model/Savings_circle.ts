import mongoose from "mongoose";

const savingsCircleSchema = new mongoose.Schema(
    {
        savingsPlanId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Savings",
            required: true,
        },
        savingsTitle: { type: String },
        subRegion: {
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
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date },
        circleIndex: { type: Number, default: 1 },
        status: {
            type: String,
            enum: ["ACTIVE", "PAUSED", "ENDED"],
            default: "ACTIVE",
        },
        maturityAmount: { type: Number },
    },
    { timestamps: true },
);

const savingsCircle = mongoose.model("Savings_circle", savingsCircleSchema);
export default savingsCircle;
