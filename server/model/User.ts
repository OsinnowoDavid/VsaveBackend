import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  referral: {
    type: String,
  },
  vsavePoint: {
    type: Number,
    default: 0,
  },
  KYC: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "KYC",
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
  pendingBalance: {
    type: Number,
    default: 0,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
  },
  address: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
