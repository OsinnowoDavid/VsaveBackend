import mongoose from "mongoose";

const savingsSchema = new mongoose.Schema({
    subRegion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Region",
        required: true,
    },
    savingsTitle: {
        type: String,
        required: true,
    },
    frequency: {
        type: String,
        enum: ["DAILY", "WEEKLY", "MONTHLY"],
        required: true,
    },
    savingsAmount: { type: Number, required: true },
    noOfcircleIndex: { type: Number, default: 1 },
    firstTimeAdminFee: { type: String },
    autoRestartEnabled: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["ACTIVE", "PAUSED", "ENDED"],
        default: "ACTIVE",
    },
    adminId: {
        type: String,
    },
});

const savings = mongoose.model("Savings", savingsSchema);
export default savings;
