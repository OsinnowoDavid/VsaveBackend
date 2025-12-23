"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const KYC1Schema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    profession: {
        type: String,
        required: true,
        enum: [
            "Lottery Agent",
            "Student",
            "Self Employed",
            "Unemployed",
            "Other",
        ],
    },
    accountNumber: {
        type: Number,
        required: true,
    },
    bank: {
        type: String,
        required: true,
    },
    accountDetails: {
        type: String,
        required: true,
    },
    bankCode: {
        type: String,
    },
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    bvn: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const KYC1 = mongoose_1.default.model("KYC1", KYC1Schema);
exports.default = KYC1;
