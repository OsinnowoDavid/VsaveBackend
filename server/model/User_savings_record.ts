import mongoose from "mongoose";

const userSavingsRecordSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to your User model
            required: true,
        },
        savingsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Savings", // Reference to your User model
            required: false,
        },
        savingsCircleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Savings_circle", // Reference to your User model
            required: true,
        },
        period: { type: Number },
        records: [
            {
                period: String,
                periodIndex: String,
                amount: Number,
                status: {
                    type: String,
                    enum: ["pending", "paid"],
                },
            },
        ],
        currentAmountSaved: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ["ACTIVE", "PAUSED", "ENDED"],
            default: "ACTIVE",
        },
        maturityAmount: {
            type: Number,
        },
        payOut: {
            type: Number,
        },
    },
    { timestamps: true },
);

const userSavingsRecord = mongoose.model(
    "User_savings_record",
    userSavingsRecordSchema,
);

export default userSavingsRecord;
