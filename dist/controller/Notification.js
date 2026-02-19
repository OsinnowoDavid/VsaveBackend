"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleNotificationsController = exports.getUserNotificationsController = void 0;
const Notification_1 = require("../services/Notification");
const getUserNotificationsController = async (req, res) => {
    try {
        const user = req.user;
        const foundNotification = await (0, Notification_1.getRecipientNotofication)(user._id.toString());
        for (const record of foundNotification) {
            if (record.status === "sent") {
                record.status = "delivered";
                await record.save();
            }
        }
        return res.json({
            status: "Success",
            message: "found Notification",
            data: foundNotification
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getUserNotificationsController = getUserNotificationsController;
const getSingleNotificationsController = async (req, res) => {
    try {
        const { id } = req.params;
        const foundNotification = await (0, Notification_1.getSingleNotification)(id);
        foundNotification.status = "seen";
        await foundNotification.save();
        return res.json({
            status: "Success",
            message: "found Notification",
            data: foundNotification
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.getSingleNotificationsController = getSingleNotificationsController;
