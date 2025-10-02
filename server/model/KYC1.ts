import mongoose from "mongoose";

const Schema = mongoose.Schema;

const KYC1Schema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        profession: {
            type: String,
            required: true,
            enum: [
                "Lottory Agent",
                "Student",
                "Self Employed",
                "Unemployed",
                "Other",
            ],
        },
        accountNumber: {
            type: Number,
            required: true,
        },
        bank: {
            type: String,
            required: true,
        },
        accountDetails: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        bvn: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const KYC1 = mongoose.model("KYC1", KYC1Schema);

export default KYC1;
