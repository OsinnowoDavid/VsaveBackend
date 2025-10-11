"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const subRegionalAdminSchema = new Schema({
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
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        required: false,
    },
    subRegion: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "SubRegion", required: true },
}, { timestamps: true });
const subRegionalAdmin = mongoose_1.default.model("SubRegionalAdmin", subRegionalAdminSchema);
exports.default = subRegionalAdmin;
