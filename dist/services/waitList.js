"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllWaitList = exports.createWaitList = void 0;
const waitList_1 = __importDefault(require("../model/waitList"));
const createWaitList = async (fullName, email, phoneNumber, interest) => {
    try {
        const newWaitList = await waitList_1.default.create({
            fullName,
            email,
            phoneNumber,
            interest
        });
        return newWaitList;
    }
    catch (err) {
        throw err;
    }
};
exports.createWaitList = createWaitList;
const getAllWaitList = async () => {
    try {
        const allWaitList = await waitList_1.default.find();
        return allWaitList;
    }
    catch (err) {
        throw err;
    }
};
exports.getAllWaitList = getAllWaitList;
