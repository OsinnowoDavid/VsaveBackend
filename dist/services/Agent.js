"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignAgentReferral = void 0;
const Agents_1 = __importDefault(require("../model/Agents"));
const Agents_referral_1 = __importDefault(require("../model/Agents_referral"));
const assignAgentReferral = async (referralCode, user) => {
    try {
        const foundAgent = await Agents_1.default.findOne({ referralCode });
        if (!foundAgent) {
            return { message: "no agent found with this referal code" };
        }
        // check if agent "agentsReferral" record is created already
        const foundReferralRecord = await Agents_referral_1.default.findOne({
            referralCode,
        });
        if (foundReferralRecord) {
            //assign referral to existing agent
            foundReferralRecord.referres.push(user._id);
            await foundReferralRecord.save();
            return { foundAgent, foundReferralRecord };
        }
        // create new record and assign referral
        const assignReferral = await Agents_referral_1.default.create({
            agent: foundAgent._id,
            referralCode,
            referres: [user],
        });
        return { foundAgent, assignReferral };
    }
    catch (err) {
        throw err;
    }
};
exports.assignAgentReferral = assignAgentReferral;
