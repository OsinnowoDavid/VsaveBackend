"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOfficer = void 0;
const Officers_1 = __importDefault(require("../model/Officers"));
const createOfficer = async () => {
    try {
        const newOfficer = await Officers_1.default.create({});
    }
    catch (err) {
        throw err;
    }
};
exports.createOfficer = createOfficer;
