import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to your User model
            required: true,
        },
        type: {
            type: String,
            enum: ["deposit", "withdrawal", "transfer", "airtime", "data"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        feeCharged: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "success", "failed", "reversed"],
            default: "pending",
        },
        transactionReference: {
            type: String,
            unique: true, // useful for payment gateways like Paystack, Flutterwave
            required: true,
        },
        remark: {
            type: String,
            trim: true,
        },
        balanceBefore: {
            type: Number,
            required: false, // track balance before transaction
        },
        balanceAfter: {
            type: Number,
            required: false, // track balance after transaction
        },
        sender: {
            type: String,
        },
        reciever: {
            type: String,
        },
        network: {
            type: String,
        },
        date: {
            type: Date,
        },
    },
    { timestamps: true },
);

export default mongoose.model("Transaction", transactionSchema);
