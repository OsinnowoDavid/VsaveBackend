import mongoose from "mongoose";

const savingsGroupSchema = new mongoose.Schema(
    {
        savingsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Savings",
            required: true,
        },
        savingsCircleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Savings_circle", // Reference to your User model
            required: true,
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Reference to your User model
                required: true,
            },
        ],
    },
    { timestamps: true },
);

const savingsGroup = mongoose.model("Savings_group", savingsGroupSchema);

export default savingsGroup;
