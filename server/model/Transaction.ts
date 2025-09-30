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
      enum: ["deposit", "withdrawal", "transfer"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "reversed"],
      default: "pending",
    },
    reference: {
      type: String,
      unique: true, // useful for payment gateways like Paystack, Flutterwave
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    channel: {
      type: String,
      enum: ["bank", "card", "wallet", "ussd", "other"],
      default: "wallet",
    },
    balanceBefore: {
      type: Number,
      required: false, // track balance before transaction
    },
    balanceAfter: {
      type: Number,
      required: false, // track balance after transaction
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
