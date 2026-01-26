import mongoose from "mongoose";
import { timeStamp } from "node:console";

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
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
        bonusBalance:{
            type:Number,
            default:0
        },
        subRegion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubRegion",
            required: false,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
        },
        gender: {
            type: String,
            enum: ["Male", "Female"],
        },
        dateOfBirth: {
            type: Date,
        },
        virtualAccountNumber: {
            type: String,
            sparse:true,
            unique: true ,
        },
        pin: {
            type: String,
        },
        kycStatus: {
            type: Boolean,
            default: false,
        },
         profession: {
            type: String,
            enum: [
                "Lottery Agent",
                "Student",
                "Self Employed",
                "Unemployed",
                "Other",
            ],
        },
      referredBy: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "referralModel", // 👈 dynamic reference
          },
          referralModel: {
            type: String,
            enum: ["User", "Officer"], // must match model names exactly
          },
        lottoryId:{
            type:String
        },
        lastSeen:{
            type:String
        },
        referralCode:{
            type:String
        }
    },
    { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
