"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
    vsavePoint: {
        type: Number,
        default: 0,
    },
    KYC: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
    bonusBalance: {
        type: Number,
        default: 0
    },
    subRegion: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        sparse: true,
        unique: true,
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        refPath: "referralModel", // 👈 dynamic reference
    },
    referralModel: {
        type: String,
        enum: ["User", "Officer"], // must match model names exactly
    },
    lottoryId: {
        type: String
    },
    lastSeen: {
        type: String
    },
    referralCode: {
        type: String
    }
}, { timestamps: true });
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
