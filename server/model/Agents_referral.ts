import mongoose from "mongoose";
const { Schema } = mongoose;

const agentReferalSchema = new Schema(
    {
        agent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agent",
            required: true,
        },
        referralCode: {
            type: String,
            required: true,
        },
        referres: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true },
);

const agentReferal = mongoose.model("Agent", agentReferalSchema);

export default agentReferal;
