"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMarkedNotification = exports.deleteNotification = exports.getUnreadNotification = exports.changeNotificationStatus = exports.getSingleNotification = exports.getRecipientNotofication = exports.getAllNotification = exports.createNotification = void 0;
const Notification_1 = __importDefault(require("../model/Notification"));
const createNotification = async (from, title, message, recipientType, recipientId, status, senderId) => {
    try {
        const newNotification = await Notification_1.default.create({
            from,
            title,
            message,
            recipientType,
            recipientId,
            status,
            senderId
        });
        return newNotification;
    }
    catch (err) {
        throw err;
    }
};
exports.createNotification = createNotification;
const getAllNotification = async () => {
    try {
        const foundNotification = await Notification_1.default.find();
        return foundNotification;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllNotification = getAllNotification;
const getRecipientNotofication = async (recipient) => {
    try {
        const foundNotification = await Notification_1.default.find({ recipientId: recipient });
        return foundNotification;
    }
    catch (err) {
        throw err;
    }
};
exports.getRecipientNotofication = getRecipientNotofication;
const getSingleNotification = async (id) => {
    try {
        const foundNotification = await Notification_1.default.findById(id);
        return foundNotification;
    }
    catch (err) {
        throw err;
    }
};
exports.getSingleNotification = getSingleNotification;
const changeNotificationStatus = async (id, status) => {
    try {
        const foundRecord = await Notification_1.default.findByIdAndUpdate(id, { status });
        return foundRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.changeNotificationStatus = changeNotificationStatus;
const getUnreadNotification = async (recipient) => {
    const foundRecord = await Notification_1.default.find({ recipient, status: "delivered" });
    return foundRecord;
};
exports.getUnreadNotification = getUnreadNotification;
const deleteNotification = async (id) => {
    try {
        const deletedRecord = await Notification_1.default.findByIdAndDelete(id);
        return deletedRecord;
    }
    catch (err) {
        throw err;
    }
};
exports.deleteNotification = deleteNotification;
const deleteMarkedNotification = async (ids) => {
    try {
        for (const id of ids) {
            await Notification_1.default.findByIdAndDelete(id);
        }
        return "Done";
    }
    catch (err) {
        throw err;
    }
};
exports.deleteMarkedNotification = deleteMarkedNotification;
