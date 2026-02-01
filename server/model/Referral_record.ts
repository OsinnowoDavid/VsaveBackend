import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Reference to your User model
                required: true,
            },
    referralCode: {
      type: String,
    },
    bonusAmount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending",
    },
    // 👇 referred user is ALWAYS a User
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referredUserTask: {
      fundVSaveWallet: {
        type: Boolean,
        default: false,
      },
      createSavingsPlan: {
        type: Boolean,
        default: false,
      },
      complete5SuccessfulSavingsCircle: {
        type: Boolean,
        default: false,
      },
    },

    depositedToAvaliableBalnace: {
      type: Boolean,
      default: false,
    },

    depositedToAvaliableBalnaceDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Referral = mongoose.model("ReferralRecord", referralSchema);
export default Referral;
