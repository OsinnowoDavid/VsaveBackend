import { Request, Response } from "express";
import { squadWebhook } from "../services/Webhook";
import crypto from "crypto";
const generateHmacSHA512 = (input: any, key: any) => {
    const hmac = crypto.createHmac("sha512", key);
    hmac.update(input);
    return hmac.digest("hex");
};
export const squadWebhookController = async (req: Request, res: Response) => {
    try {
        console.log("Squad webhook started");

        const signatureFromHeader = req.headers["x-squad-signature"];
        if (!signatureFromHeader) {
            return res
                .status(400)
                .json({ message: "Missing signature header" });
        }

        const payload = req.body;
        const {
            transaction_reference,
            virtual_account_number,
            currency,
            principal_amount,
            settled_amount,
            customer_identifier,
        } = payload;
        await squadWebhook(payload, "signing");
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
        console.log("String to sign:", dataToHash);

        const secret = process.env.SQUAD_SECRET_KEY;
        if (!secret) {
            throw new Error(
                "SQUAD_SECRET_KEY missing in environment variables",
            );
        }
        // const generatedHash = generateHmacSHA512(
        //     dataToHash,
        //     process.env.SQUAD_SECRET_KEY,
        // );
        const hash = crypto
            .createHmac("sha512", secret)
            .update(JSON.stringify(req.body))
            .digest("hex");
        if (hash !== signatureFromHeader) {
            console.error("Signature mismatch", {
                computed: hash,
                received: signatureFromHeader,
                payload: req.body,
            });
            return res.status(400).json({
                response_code: 400,
                transaction_reference,
                response_description: "Validation failure",
            });
        }

        // process the valid payload

        return res.status(200).json({
            response_code: 200,
            transaction_reference,
            response_description: "Success",
        });
    } catch (err: any) {
        console.error("❌ Webhook Error:", err);
        return res.status(500).json({
            response_code: 500,
            message: err.message,
        });
    }
};
