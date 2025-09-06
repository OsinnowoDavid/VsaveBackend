import mongoose from "mongoose";
import KYCModel from "./KYC.js";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  middlename: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  phone_no: {
    type: String,
    required: true,
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
    required: true,
  },
  vsave_point: {
    type: Number,
    required: true,
  },
  KYC: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "KYC",
  },
});

const User = mongoose.model("User", userSchema);

export default User;
