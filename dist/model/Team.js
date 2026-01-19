"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const teamSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    subRegion: { type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "SubRegion", },
    teamLeader: [{ type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Officer", }],
    groups: [{ type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Group", }],
});
