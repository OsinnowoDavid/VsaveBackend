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
        console.log("start webhook");
        const signatureFromHeader = req.headers["x-squad-signature"];
        if (!signatureFromHeader) {
            return res
                .status(400)
                .send({ message: "Missing signature header" });
        }
        const payload = req.body;
        // Build the string to sign (six fields, in order)
        const { transaction_reference, virtual_account_number, currency, principal_amount, settled_amount, customer_identifier, } = payload;
        const dataToSign = [
            transaction_reference,
            virtual_account_number,
            currency,
            principal_amount,
            settled_amount,
            customer_identifier,
        ].join("|");
        // Compute HMAC-SHA512
        const hmac = crypto_1.default.createHmac("sha512", process.env.SQUAD_SECRET_KEY);
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
        console.log("got webhook payload", payload);
        await (0, Webhook_1.squadWebhook)(payload, signatureFromHeader);
        // Finally respond back to Squad
        return res.status(200).json({
            response_code: 200,
            transaction_reference: transaction_reference,
            response_description: "Success",
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.squadWebhookController = squadWebhookController;
