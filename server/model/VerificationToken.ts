import mongoose from "mongoose";

const Schema = mongoose.Schema;

const verificationTokenSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        email: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true },
);

const VerificationToken = mongoose.model(
    "VerificationToken",
    verificationTokenSchema,
);

export default VerificationToken;
