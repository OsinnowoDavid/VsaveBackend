import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com", // Replace with the correct SMTP host
    port: 465, // Correct port for secure SMTP
    secure: true,
    auth: {
        user: process.env.User,
        pass: process.env.Pass,
    },
});

export default transporter;
