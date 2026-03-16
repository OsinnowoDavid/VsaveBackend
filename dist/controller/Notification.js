"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationCountController = exports.deleteMarkedNotificationController = exports.deleteNotificationController = exports.getSingleNotificationsController = exports.getUserNotificationsController = void 0;
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
const deleteNotificationController = async (req, res) => {
    try {
        const { id } = req.params;
        await (0, Notification_1.deleteNotification)(id);
        return res.json({
            status: "Success",
            message: "Notification deleted successfuly !"
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.deleteNotificationController = deleteNotificationController;
const deleteMarkedNotificationController = async (req, res) => {
    try {
        const { ids } = req.body;
        await (0, Notification_1.deleteMarkedNotification)(ids);
        return res.json({
            status: "Success",
            message: "Notification deleted successfuly !"
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.deleteMarkedNotificationController = deleteMarkedNotificationController;
const notificationCountController = async (req, res) => {
    try {
        const user = req.user;
        const count = await (0, Notification_1.notificationCount)(user._id.toString());
        return res.json({
            status: "Success",
            message: "notification counted",
            data: count
        });
    }
    catch (err) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
exports.notificationCountController = notificationCountController;
