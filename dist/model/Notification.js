"use strict";
const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: [
            "superAdmin-to-admins",
            "superAdmin-to-user",
            "superAdmin-to-Agent",
            "admins-to-user",
            "admins-to-agents",
            "app-to-users",
        ],
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
        enum: ["User", "Regionaladmin", "SubRegionalAdmin", "Agent"], // your 4 collections
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "recipientType", // dynamic reference here
    },
    senderType: {
        type: String,
        required: true,
        enum: [
            "Superadmin",
            "Regionaladmin",
            "SubRegionalAdmin",
            "VsaveApp",
        ], // your 4 collections
    },
    senderId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["sent", "delivered", "seen"],
    },
}, { timestamps: true });
module.exports = mongoose.model("Notification", notificationSchema);
