"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const officerSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["OFFICER", "GROUP LEADER", "TEAM LEADER"]
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        required: false,
    },
    referralCode: {
        type: String,
        required: true,
    },
    group: { type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Group", },
    team: { type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Team", }
});
const officer = mongoose_1.default.model("Officer", officerSchema);
exports.default = officer;
