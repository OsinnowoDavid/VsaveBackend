"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const groupsSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    team: { type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Team", },
    groupLeader: [{ type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Officer", }],
    officers: [{ type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Officer", }]
});
const groups = mongoose_1.default.model("Group", groupsSchema);
exports.default = groups;
