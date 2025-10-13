import { Request, Response } from "express";
import { squadWebhook } from "../services/Webhook";
import crypto from "crypto";

export const squadWebhookController = async (req: Request, res: Response) => {
    try {
        console.log("start webhook")
        const signatureFromHeader = req.headers["x-squad-signature"];
        if (!signatureFromHeader) {
            return res
                .status(400)
                .send({ message: "Missing signature header" });
        }

        const payload = req.body;

        // Build the string to sign (six fields, in order)
        const {
            transaction_reference,
            virtual_account_number,
            currency,
            principal_amount,
            settled_amount,
            customer_identifier,
        } = payload;

        const dataToSign = [
            transaction_reference,
            virtual_account_number,
            currency,
            principal_amount,
            settled_amount,
            customer_identifier,
        ].join("|");

        // Compute HMAC-SHA512
        const hmac = crypto.createHmac("sha512", process.env.SQUAD_SECRET_KEY!);
        hmac.update(dataToSign);
        const computedSignature = hmac.digest("hex");

        if (computedSignature !== signatureFromHeader) {
            // signature mismatch
            console.error("Signature mismatch", {
                computed: computedSignature,
                received: signatureFromHeader,
            });
            return res.status(400).json({
                response_code: 400,
                transaction_reference: transaction_reference,
                response_description: "Validation failure",
            });
        }

        // signature good — now process
        // 1. Check duplicates: have we seen this transaction_reference already?
        // 2. If not, record payment, credit the user's account etc.

        console.log("got webhook payload", payload)

         await squadWebhook(payload,signatureFromHeader) ;
        // Finally respond back to Squad
        return res.status(200).json({
            response_code: 200,
            transaction_reference: transaction_reference,
            response_description: "Success",
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
