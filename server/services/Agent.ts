import Agent from "../model/Agents";
import AgentsReferral from "../model/Agents_referral";
import { IUser } from "../types";

export const assignAgentReferral = async (
    referralCode: string,
    user: IUser,
) => {
    try {
        const foundAgent = await Agent.findOne({ referralCode });
        if (!foundAgent) {
            return { message: "no agent found with this referal code" };
        }
        // check if agent "agentsReferral" record is created already
        const foundReferralRecord = await AgentsReferral.findOne({
            referralCode,
        });
        if (foundReferralRecord) {
            //assign referral to existing agent
            foundReferralRecord.referres.push(user._id);
            await foundReferralRecord.save();
            return { foundAgent, foundReferralRecord };
        }
        // create new record and assign referral
        const assignReferral = await AgentsReferral.create({
            agent: foundAgent._id,
            referralCode,
            referres: [user],
        });
        return { foundAgent, assignReferral };
    } catch (err: any) {
        throw err;
    }
};
