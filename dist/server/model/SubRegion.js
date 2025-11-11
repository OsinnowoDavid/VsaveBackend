"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const subRegionSchema = new Schema({
    subRegionName: {
        type: String,
        required: true,
    },
    shortCode: {
        type: String,
        required: true,
    },
    region: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Region",
        required: true,
    },
    admin: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "SubRegionAdmin" },
    ],
    agent: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Agent" }],
    user: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });
const subRegion = mongoose_1.default.model("SubRegion", subRegionSchema);
exports.default = subRegion;
