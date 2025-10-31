import { Request, Response } from "express";
import { squadWebhook } from "../services/Webhook";
import {
    checkTransferByRefrence,
    deposit,
    getUserById,
    createUserTransaction,
} from "../services/User";
import { IUser } from "../types";
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
        const hash = crypto
            .createHmac("sha512", process.env.SQUAD_SECRET_KEY!)
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
        const foundTransferRefrence = await checkTransferByRefrence(
            payload.transaction_reference,
        );
        if (foundTransferRefrence) {
            console.log("transaction already exist");
            return res.status(200).json({
                response_code: 200,
                response_description: "Success transaction already exist",
            });
        }
        // deposit money to users account
        const foundUser = (await getUserById(
            payload.customer_identifier,
        )) as IUser;
        let beforeBalance = foundUser.availableBalance;
        let afterBalance = foundUser.availableBalance + payload.settled_amount;
        await deposit(foundUser, payload.settled_amount);
        // save webhook
        await squadWebhook(payload, signatureFromHeader);
        // save transaction record
        await createUserTransaction(
            foundUser._id.toString(),
            "deposit",
            payload.transaction_reference,
            payload.settled_amount,
            beforeBalance,
            afterBalance,
            payload.remark,
            "success",
            payload.transaction_date,
            payload.sender_name,
            "",
            payload.fee_charged,
        );

        return res.status(200).json({
            response_code: 200,
            response_description: "Success",
        });
    } catch (err: any) {
        console.error("Webhook Error:", err);
        return res.status(500).json({
            response_code: 500,
            message: err.message,
        });
    }
};
