import mongoose from "mongoose";

const webhookSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        payload: {
            type: Object, // full JSON body from Squad
            required: true,
        },
        signature: {
            type: String, // x-squad-signature header (HMAC hash)
        },
    },
    { timestamps: true },
);

export default mongoose.model("Webhook", webhookSchema);
