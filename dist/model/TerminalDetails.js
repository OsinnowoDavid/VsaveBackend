"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const terminalDetailsSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", // Reference to your User model
        required: true,
    },
    lottoryId: {
        type: String,
        required: true
    },
    terminalBalance: {
        type: Number,
        default: 0
    },
    bonusBalance: {
        type: Number,
        default: 0
    }
}, { timestamps: true });
const terminalDetails = mongoose_1.default.model("terminalDetails", terminalDetailsSchema);
exports.default = terminalDetails;
