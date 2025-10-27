import { Request, Response } from "express";
import argon from "argon2";
import { signUserToken } from "../config/JWT";
import { getSubRegionalAdminByEmail } from "../services/RegionalAdmin";
import { createAgent, initSavingsPlan } from "../services/subRegionalAdmin";

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const foundAdmin = await getSubRegionalAdminByEmail(email);
        if (!foundAdmin) {
            return res.json({
                status: "Failed",
                message: "User Not Found",
            });
        }
        let verifyPassword = await argon.verify(foundAdmin.password, password);
        if (!verifyPassword) {
            return res.json({
                status: "Failed",
                message: "incorrect Passsword",
            });
        }

        // Return success with JWT token
        return res.json({
            Status: "success",
            message: "login successfuly",
            token: signUserToken(foundAdmin),
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const createAgentController = async (req: Request, res: Response) => {
    try {
        const {
            firstName,
            lastName,
            email,
            subRegion,
            password,
            phoneNumber,
            profilePicture,
        } = req.body;
        let hashPassword = await argon.hash(password);
        const newAgent = await createAgent(
            firstName,
            lastName,
            email,
            phoneNumber,
            subRegion,
            hashPassword,
            profilePicture,
        );
        if (!newAgent) {
            return res.json({
                status: "Failed",
                message: "something went wrong",
            });
        }
        return res.json({
            status: "Success",
            message: "Agent account created successfuly",
            data: newAgent,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};

export const createSavingPlanController = async (
    req: Request,
    res: Response,
) => {
    try {
        const {
            subRegion,
            frequency,
            savingAmount,
            startDate,
            endDate,
            status,
            autoRestartEnabled,
        } = req.body;
        const user = req.user as any;
        const newSavings = await initSavingsPlan(
            user._id.toString(),
            subRegion,
            frequency,
            savingAmount,
            startDate,
            endDate,
            status,
            autoRestartEnabled,
        );
        return res.json({
            status: "success",
            message: "plan created",
            data: newSavings,
        });
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
