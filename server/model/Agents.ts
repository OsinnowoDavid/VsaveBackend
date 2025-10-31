import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AgentSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        subRegion: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Region",
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            required: false,
        },
        referralCode: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const Agent = mongoose.model("Agent", AgentSchema);

export default Agent;
