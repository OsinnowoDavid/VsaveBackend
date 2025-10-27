"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminConfigSchema = new mongoose_1.default.Schema({
    defaultPenaltyFee: {
        type: String,
    },
    firstTimeAdminFee: {
        type: String,
    },
}, { collection: "settings" });
adminConfigSchema.statics.getSettings = async function () {
    const settings = await this.findOne();
    if (!settings) {
        const defaultSettings = new this({
            defaultPenaltyFee: "0",
            firstTimeAdminFee: "0",
        });
        await defaultSettings.save();
        return defaultSettings;
    }
    return settings;
};
const AdminConfig = mongoose_1.default.model("Admin_config", adminConfigSchema);
exports.default = AdminConfig;
