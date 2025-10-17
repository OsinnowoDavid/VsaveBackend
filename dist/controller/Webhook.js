"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.squadWebhookController = void 0;
const Webhook_1 = require("../services/Webhook");
const User_1 = require("../services/User");
const crypto_1 = __importDefault(require("crypto"));
const generateHmacSHA512 = (input, key) => {
    const hmac = crypto_1.default.createHmac("sha512", key);
    hmac.update(input);
    return hmac.digest("hex");
};
const squadWebhookController = async (req, res) => {
    try {
        console.log("Squad webhook started");
        const signatureFromHeader = req.headers["x-squad-signature"];
        if (!signatureFromHeader) {
            return res
                .status(400)
                .json({ message: "Missing signature header" });
        }
        const payload = req.body;
        const hash = crypto_1.default
            .createHmac("sha512", process.env.SQUAD_SECRET_KEY)
            .update(JSON.stringify(payload))
            .digest("hex");
        if (hash !== signatureFromHeader) {
            console.error("Signature mismatch", {
                computed: hash,
                received: signatureFromHeader,
                payload: req.body,
            });
            return res.status(400).json({
                response_code: 400,
                response_description: "Validation failure",
            });
        }
        // process the valid payload
        // check if transaction_ref exist
        const foundTransferRefrence = await (0, User_1.checkTransferByRefrence)(payload.transaction_reference);
        if (foundTransferRefrence) {
            return res.status(200).json({
                response_code: 200,
                response_description: "Success transaction already exist",
            });
        }
        // deposit money to users account
        const foundUser = (await (0, User_1.getUserById)(payload.customer_identifier));
        let beforeBalance = foundUser.availableBalance;
        let afterBalance = foundUser.availableBalance + payload.settled_amount;
        await (0, User_1.deposit)(foundUser, payload.settled_amount);
        // save webhook
        await (0, Webhook_1.squadWebhook)(payload, signatureFromHeader);
        // save transaction record
        await (0, User_1.createUserTransaction)(foundUser._id.toString(), "deposit", payload.transaction_reference, payload.settled_amount, beforeBalance, afterBalance, payload.remark, "success", payload.transaction_date, payload.sender_name, "", payload.fee_charged);
        return res.status(200).json({
            response_code: 200,
            response_description: "Success",
        });
    }
    catch (err) {
        console.error("Webhook Error:", err);
        return res.status(500).json({
            response_code: 500,
            message: err.message,
        });
    }
};
exports.squadWebhookController = squadWebhookController;
