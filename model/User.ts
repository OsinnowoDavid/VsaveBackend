import mongoose from "mongoose";
import KYCModel from "./KYC.js";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone_no: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  profile_pic: {
    type: String,
    required: false,
  },
  referral_code: {
    type: String,
  },
  vsave_point: {
    type: Number,
    default: 0,
  },
  KYC: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "KYC",
  },
  available_balance: {
    type: Number,
    default: 0,
  },
  pending_balance: {
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
