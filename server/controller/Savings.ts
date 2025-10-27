import { Request, Response } from "express";
import { initSavingsPlan } from "../services/Savings";

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
