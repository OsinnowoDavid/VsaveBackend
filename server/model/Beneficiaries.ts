import mongoose, { Schema } from "mongoose";

const BeneficiarySchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    accountName: {
      type: String,
      required: true,
      trim: true
    },

    accountNumber: {
      type: String,
      required: true,
      trim: true
    },

    bankName: {
      type: String,
      required: true
    },

    bankCode: {
      type: String
    },

    nickname: {
      type: String
    },

    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);
const Beneficiary = mongoose.model("beneficiary", BeneficiarySchema)
export default Beneficiary