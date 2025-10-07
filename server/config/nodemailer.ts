import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "box.eedu.tech",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.User,
        pass: process.env.Pass,
    },
});

export default transporter;
