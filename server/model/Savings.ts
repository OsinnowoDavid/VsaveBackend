import mongoose from "mongoose";

const savingsSchema = new mongoose.Schema({
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
    savingAmount: { type: Number, required: true },
    circleIndex: { type: Number, default: 1 },
    autoRestartEnabled: { type: Boolean, default: true },
    status: {
        type: String,
        enum: ["ACTIVE", "PAUSED", "ENDED"],
        default: "ACTIVE",
    },
});

const savings = mongoose.model("Savings", savingsSchema);
export default savings;
