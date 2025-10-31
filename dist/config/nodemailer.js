"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
console.log("pass and user:", process.env.User, process.env.Pass);
const transporter = nodemailer_1.default.createTransport({
    host: "box.eedu.tech",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.User,
        pass: process.env.Pass,
    },
});
exports.default = transporter;
