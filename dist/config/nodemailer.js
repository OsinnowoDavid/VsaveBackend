"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
console.log("Email User:", process.env.User ? "Exists" : "Missing");
console.log("Email Pass:", process.env.Pass ? "Exists" : "Missing");
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587, // Use 587 for TLS (more reliable than 465)
    secure: false, // false for TLS
    auth: {
        user: process.env.User,
        pass: process.env.Pass, // Should be an App Password, not regular password
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000, // 10 seconds
    socketTimeout: 30000, // 30 seconds
});
// Verify transporter configuration on startup
transporter.verify(function (error, success) {
    if (error) {
        console.error("Transporter verification failed:", error);
    }
    else {
        console.log("Email transporter is ready to send messages");
    }
});
exports.default = transporter;
