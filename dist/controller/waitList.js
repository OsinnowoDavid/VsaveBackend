"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllWaitListController = exports.createWaitListController = void 0;
const waitList_1 = require("../services/waitList");
const createWaitListController = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, interest } = req.body;
        const newList = await (0, waitList_1.createWaitList)(fullName, email, phoneNumber, interest);
        return res.status(200).json({
            response_code: 200,
            message: "wait list created",
            data: newList
        });
    }
    catch (err) {
        return res.status(500).json({
            response_code: 500,
            message: err.message,
        });
    }
};
exports.createWaitListController = createWaitListController;
const getAllWaitListController = async (req, res) => {
    try {
        const foundRecord = await (0, waitList_1.getAllWaitList)();
        return res.status(200).json({
            response_code: 200,
            message: "wait list created",
            data: foundRecord
        });
    }
    catch (err) {
        return res.status(500).json({
            response_code: 500,
            message: err.message,
        });
    }
};
exports.getAllWaitListController = getAllWaitListController;
