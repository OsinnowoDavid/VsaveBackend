"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const referralSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        refPath: "userModel", // 👈 dynamic reference
    },
    userModel: {
        type: String,
        required: true,
        enum: ["User", "Officer"], // must match model names exactly
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
const Referral = mongoose_1.default.model("ReferralRecord", referralSchema);
exports.default = Referral;
