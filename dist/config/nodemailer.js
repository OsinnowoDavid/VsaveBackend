"use strict";
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// // Load environment variables from .env file
// dotenv.config();
// console.log("Email User:", process.env.User ? "Exists" : "Missing");
// console.log("Email Pass:", process.env.Pass ? "Exists" : "Missing");
// /
// const transporter = nodemailer.createTransport({
//     //service: "gmail",
//     host: "box.eedu.tech",
//     port: 465, // Use 587 for TLS (more reliable than 465)
//     secure: true, // false for TLS
//     auth: {
//         user: process.env.User,
//         pass: process.env.Pass, // Should be an App Password, not regular password
//     },
// });
// // Verify transporter configuration on startup
// transporter.verify(function (error, success) {
//     if (error) {
//         console.error("Transporter verification failed:", error);
//     } else {
//         console.log("Email transporter is ready to send messages");
//     }
// });
// export default transporter;
