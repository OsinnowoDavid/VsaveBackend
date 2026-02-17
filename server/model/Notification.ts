import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema(
    {
        from: {
            type: String,
            required: true,
            enum: ["ADMIN", "VSAVE-APP"],
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        recipientType: {
            type: String,
            required: true,
            enum: ["User", "Admin"], // your 4 collections
        },
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "recipientType", // dynamic reference here
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: false,
        },
        status: {
            type: String,
            required: true,
            enum: ["sent", "delivered", "seen"],
        },
    },
    { timestamps: true },
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification 