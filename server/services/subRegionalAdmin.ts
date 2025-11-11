import SubRegion from "../model/SubRegion";
import Agent from "../model/Agents";
import AgentReferral from "../model/Agents_referral";
import { IAgent } from "../../types";
import Savings from "../model/Savings";
import SavingCircle from "../model/Savings_circle";
import SavingsGroup from "../model/Savings_group";
import AdminSavingsConfig from "../model/Admin_config";
import savingsCircle from "../model/Savings_circle";
const checkReferralCode = async (code: string) => {
    try {
        const foundCode = (await Agent.findOne({
            referralCode: code,
        })) as IAgent;
        return foundCode.referralCode;
    } catch (err: any) {
        throw err;
    }
};
const generateReferralCode = async () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    let foundCode = "";

    do {
        for (let i = 0; i < 7; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            code += chars[randomIndex];
        }
        foundCode = await checkReferralCode(code);
    } while (foundCode);

    return code;
};
export const createAgent = async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    subRegion: string,
    password: string,
    profilePicture?: string,
) => {
    try {
        let code = await generateReferralCode();

        const newAgent = await Agent.create({
            firstName,
            lastName,
            email,
            subRegion,
            password,
            phoneNumber,
            profilePicture,
            referralCode: code,
        });

        // create new agentReferral record
        const newAgentReferral = AgentReferral.create({
            agent: newAgent._id,
            referralCode: newAgent.referralCode,
        });
        return newAgent;
    } catch (err: any) {
        throw err;
    }
};
