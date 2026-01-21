"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const regionSchema = new Schema({
    regionName: {
        type: String,
        required: true,
    },
    shortCode: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    admin: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Admin" }],
    subRegion: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Agent" }],
}, { timestamps: true });
const region = mongoose_1.default.model("Region", regionSchema);
exports.default = region;
