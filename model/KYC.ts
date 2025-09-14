import mongoose from "mongoose";

const Schema = mongoose.Schema;

const KYCSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    kycStage: { type: Number, enum: [1, 2, 3, 4] },
    status: { type: String, enum: ["pending", "verified", "rejected"] },
    documents: [
      {
        kyc_stage: { type: Number, enum: [1, 2, 3, 4] },
        documents: [String],
      },
    ],
  },
  { timestamps: true }
);

const KYCModel = mongoose.model("KYC", KYCSchema);

export default KYCModel;
