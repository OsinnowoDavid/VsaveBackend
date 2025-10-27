"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const savingsGroupSchema = new mongoose_1.default.Schema({
    savingsId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Savings",
        required: true,
    },
    savingsCircleId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Savings_circle", // Reference to your User model
        required: true,
    },
    users: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User", // Reference to your User model
            required: true,
        },
    ],
}, { timestamps: true });
const savingsGroup = mongoose_1.default.model("Savings_group", savingsGroupSchema);
exports.default = savingsGroup;
