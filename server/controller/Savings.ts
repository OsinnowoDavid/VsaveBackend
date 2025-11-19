import { Request, Response } from "express";
import { initSavingsPlan } from "../services/Savings";
import { calculateMaturityAmount, calculateEndDate } from "../config/tools";

export const createSavingPlanController = async (
    req: Request,
    res: Response,
) => {
    try {
        const {
            subRegion,
            savingsTitle,
            frequency,
            savingsAmount,
            startDate,
            deductionPeriod,
            duration,
        } = req.body;
        const user = req.user as any;
        let maturityAmount = calculateMaturityAmount(
            frequency,
            duration,
            savingsAmount,
            startDate,
        );

        const newSavingsPlan = await initSavingsPlan(
            user._id.toString(),
            subRegion,
            savingsTitle,
            frequency,
            savingsAmount,
            "ACTIVE",
            deductionPeriod,
            duration,
            maturityAmount,
        );
    } catch (err: any) {
        return res.json({
            status: "Failed",
            message: err.message,
        });
    }
};
