"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const AgentSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    middlename: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    phone_no: {
        type: String,
        required: true,
    },
    region: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Region",
        required: true,
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
        required: true,
    },
    referres: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, { timestamps: true });
const Admin = mongoose_1.default.model("Agent", AgentSchema);
exports.default = Admin;
