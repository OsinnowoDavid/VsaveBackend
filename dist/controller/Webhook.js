"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.squadWebhookController = void 0;
const Webhook_1 = require("../services/Webhook");
const crypto_1 = __importDefault(require("crypto"));
const squadWebhookController = async (req, res) => {
    try {
        console.log("🚀 Squad webhook started");
        const signatureFromHeader = req.headers["x-squad-signature"];
        if (!signatureFromHeader) {
            return res
                .status(400)
                .json({ message: "Missing signature header" });
        }
        const payload = req.body;
        const { transaction_reference, virtual_account_number, currency, principal_amount, settled_amount, customer_identifier, } = payload;
        await (0, Webhook_1.squadWebhook)(payload, "signing");
        // const dataToSign = [
        //     String(transaction_reference ?? "").trim(),
        //     String(virtual_account_number ?? "").trim(),
        //     String(currency ?? "").trim(),
        //     String(principal_amount ?? "").trim(),
        //     String(settled_amount ?? "").trim(),
        //     String(customer_identifier ?? "").trim(),
        // ].join("|");
        console.log("data:", req.body);
        let dataToHash = `${transaction_reference}|${virtual_account_number}|${currency}|${principal_amount}|${settled_amount}|${customer_identifier}`;
        console.log("🧾 String to sign:", dataToHash);
        const secret = process.env.SQUAD_SECRET_KEY;
        if (!secret) {
            throw new Error("SQUAD_SECRET_KEY missing in environment variables");
        }
        const hmac = crypto_1.default.createHmac("sha512", Buffer.from(secret, "utf8"));
        hmac.update(dataToHash, "utf8");
        const computedSignature = hmac.digest("hex").trim().toLowerCase();
        const receivedSignature = signatureFromHeader
            .trim()
            .toLowerCase();
        if (computedSignature !== receivedSignature) {
            console.error("⚠️ Signature mismatch", {
                computed: computedSignature,
                received: receivedSignature,
                payload: req.body,
            });
            return res.status(400).json({
                response_code: 400,
                transaction_reference,
                response_description: "Validation failure",
            });
        }
        console.log("✅ Valid Squad webhook received:", transaction_reference);
        // process the valid payload
        return res.status(200).json({
            response_code: 200,
            transaction_reference,
            response_description: "Success",
        });
    }
    catch (err) {
        console.error("❌ Webhook Error:", err);
        return res.status(500).json({
            response_code: 500,
            message: err.message,
        });
    }
};
exports.squadWebhookController = squadWebhookController;
