"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
