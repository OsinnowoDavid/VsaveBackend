"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const KYCSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    kycStage: { type: Number, enum: [1, 2, 3, 4] },
    status: { type: String, enum: ["pending", "verified", "rejected"] },
    documents: [
        {
            kyc_stage: { type: Number, enum: [1, 2, 3, 4] },
            documents: [String],
        },
    ],
}, { timestamps: true });
const KYCModel = mongoose_1.default.model("KYC", KYCSchema);
exports.default = KYCModel;
