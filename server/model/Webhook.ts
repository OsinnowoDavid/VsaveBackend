import mongoose from "mongoose";

const webhookSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["squad", "paystack", "flutterwave", "other"],
      default: "squad",
    },
    eventType: {
      type: String,
      trim: true, // e.g., "virtual_account.credit", "dynamic_va.expired"
    },
    transactionReference: {
      type: String,
      index: true,
    },
    virtualAccountNumber: {
      type: String,
      index: true,
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
      default: "NGN",
    },
    status: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "pending",
    },
    rawPayload: {
      type: Object, // full JSON body from Squad
      required: true,
    },
    signature: {
      type: String, // x-squad-signature header (HMAC hash)
    },
    processedAt: {
      type: Date,
    },
    error: {
      type: String, // if processing failed, store reason
    },
  },
  { timestamps: true }
);

export default mongoose.model("Webhook", webhookSchema);
