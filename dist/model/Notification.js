"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    from: {
        type: String,
        required: true,
        enum: ["ADMIN", "VSAVE-APP"],
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    recipientType: {
        type: String,
        required: true,
        enum: ["User", "Admin"], // your 4 collections
    },
    recipientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        refPath: "recipientType", // dynamic reference here
    },
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Admin",
        required: false,
    },
    status: {
        type: String,
        required: true,
        enum: ["sent", "delivered", "seen"],
    },
}, { timestamps: true });
const Notification = mongoose_1.default.model("Notification", notificationSchema);
exports.default = Notification;
