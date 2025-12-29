"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AdminSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["SUPER ADMIN", "REGIONAL ADMIN", "SUBREGIONAL ADMIN"],
        required: true,
    },
    region: [String],
    subRegion: [String],
    profilePicture: {
        type: String
    }
}, { timestamps: true });
const Admin = mongoose_1.default.model("Admin", AdminSchema);
exports.default = Admin;
