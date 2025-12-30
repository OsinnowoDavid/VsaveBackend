"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userReferralSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", // Reference to your User model
        required: true,
    },
    bonusAmount: {
        type: Number,
    },
    status: {
        type: String,
        enum: ["pending", "completed", "rejected"]
    },
    referredUser: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", // Reference to your User model
        required: true,
    },
    referredUserTask: {
        fundVSaveWallet: {
            type: Boolean,
            default: false
        },
        createSavingsPlan: {
            type: Boolean,
            default: false
        },
        complete5SuccessfulSavingsCircle: {
            type: Boolean,
            default: false
        },
    }
}, { timestamps: true });
const userReferral = mongoose_1.default.model("user_referral", userReferralSchema);
exports.default = userReferral;
