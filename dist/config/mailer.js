"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const mailTransporter = async (to, message, subject) => {
    try {
        let data = JSON.stringify({
            to: to,
            name: "Vsave",
            subject: subject,
            message: message,
        });
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://eedu.tech/api/v1/mail/send",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            data: data,
        };
        const sentMail = await axios_1.default.request(config);
        return sentMail;
    }
    catch (err) {
        console.log("err:", err);
        throw err;
    }
};
exports.default = mailTransporter;
