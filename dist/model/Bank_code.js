"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bankCodeSchema = new mongoose_1.default.Schema({
    bankCode: {
        type: String,
    },
    bank: {
        type: String,
    },
});
const bankCode = mongoose_1.default.model("bank_code", bankCodeSchema);
exports.default = bankCode;
