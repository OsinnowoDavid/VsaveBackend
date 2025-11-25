import { Request, Response } from "express";
import { initSavingsPlan } from "../services/Savings";
import { calculateMaturityAmount, calculateEndDate } from "../config/tools";
import AdminSavingsConfig from "../model/Admin_config";

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
        const { firstTimeAdminFee } = await AdminSavingsConfig.getSettings();
        let maturityAmount = calculateMaturityAmount(
            frequency,
            duration,
            savingsAmount,
            Number(firstTimeAdminFee),
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
