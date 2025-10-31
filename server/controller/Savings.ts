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
            savingAmount,
            startDate,
            autoRestartEnabled,
            deductionPeriod,
            duration,
        } = req.body;
        const user = req.user as any;
        let endDate = calculateEndDate(frequency, startDate, duration);
        let maturityAmount = calculateMaturityAmount(
            frequency,
            duration,
            savingAmount,
            startDate,
        );
        let status = "";
        let currentDate = new Date().toLocaleDateString("en-US");
        console.log("compare:", { startDate, currentDate });
        if (currentDate == startDate) {
            status = "ACTIVE";
        } else {
            status = "PENDING";
        }
        const newSavings = await initSavingsPlan(
            user._id.toString(),
            subRegion,
            savingsTitle,
            frequency,
            savingAmount,
            startDate,
            endDate,
            status,
            autoRestartEnabled,
            deductionPeriod,
            duration,
            maturityAmount,
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
