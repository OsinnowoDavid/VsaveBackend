"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: "smtp.gmail.com", // Replace with the correct SMTP host
    port: 465, // Correct port for secure SMTP
    secure: true,
    auth: {
        user: process.env.User,
        pass: process.env.Pass,
    },
});
exports.default = transporter;
