"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.squadWebhook = void 0;
const Webhook_1 = __importDefault(require("../model/Webhook"));
const squadWebhook = async (payload, signature) => {
    try {
        const newWebhook = await Webhook_1.default.create({
            user: payload.customer_identifier,
            payload,
            signature,
        });
        return newWebhook;
    }
    catch (err) {
        throw err;
    }
};
exports.squadWebhook = squadWebhook;
