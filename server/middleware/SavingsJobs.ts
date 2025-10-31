import {
    getAllActiveSavingsGroup,
    getSavingsById,
    getCircleById,
} from "../services/Savings";
import { userWithdraw, updateUserSavingsRecords } from "../services/User";
import { ISavingsCircle, ISavingsPlan } from "../types";
import BankCode from "../model/Bank_code";
import { getDayName } from "../config/tools";

const checkPlanForUserDeduction = async (plan: any) => {
    for (const user of plan.users) {
        let dateFormat = new Date();
        let todaysDate = `${(dateFormat.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${dateFormat
            .getDate()
            .toString()
            .padStart(2, "0")}/${dateFormat.getFullYear()}`;
        const savingsDetails = (await getCircleById(
            plan.savingsCircleId,
        )) as ISavingsCircle;
        let remark = `${savingsDetails?.savingsAmount}N is withdrawn from your account for ${savingsDetails?.savingsTitle} Plan`;
        // check and deduct based on frequency
        if (savingsDetails.frequency === "MONTHLY") {
            if (savingsDetails.deductionPeriod === todaysDate) {
                const withdraw = await userWithdraw(
                    user,
                    savingsDetails.savingsAmount,
                    remark,
                );
                if (withdraw === "Insufficient Funds") {
                    await updateUserSavingsRecords(
                        user,
                        plan.savingsCircleId,
                        savingsDetails.savingsAmount,
                        plan.periods,
                        "pending",
                    );
                    return;
                }
                await updateUserSavingsRecords(
                    user,
                    plan.savingsCircleId,
                    savingsDetails.savingsAmount,
                    plan.periods,
                    "paid",
                );
            } else {
                return;
            }
        } else if ((savingsDetails.frequency = "WEEKLY")) {
            if (savingsDetails.deductionPeriod === getDayName(todaysDate)) {
                const withdraw = await userWithdraw(
                    user,
                    savingsDetails.savingsAmount,
                    remark,
                );
                if (withdraw === "Insufficient Funds") {
                    await updateUserSavingsRecords(
                        user,
                        plan.savingsCircleId,
                        savingsDetails.savingsAmount,
                        plan.periods,
                        "pending",
                    );
                    return;
                }
                await updateUserSavingsRecords(
                    user,
                    plan.savingsCircleId,
                    savingsDetails.savingsAmount,
                    plan.periods,
                    "paid",
                );
            } else {
                return;
            }
        } else {
            const withdraw = await userWithdraw(
                user,
                savingsDetails.savingsAmount,
                remark,
            );
            if (withdraw === "Insufficient Funds") {
                await updateUserSavingsRecords(
                    user,
                    plan.savingsCircleId,
                    savingsDetails.savingsAmount,
                    plan.periods,
                    "pending",
                );
                return;
            }
            await updateUserSavingsRecords(
                user,
                plan.savingsCircleId,
                savingsDetails.savingsAmount,
                plan.periods,
                "paid",
            );
        }
    }
};
export const deductSavingsFromUser = async () => {
    try {
        const activePlan = await getAllActiveSavingsGroup();
        for (const plan of activePlan) {
            await checkPlanForUserDeduction(plan);
        }
    } catch (err: any) {
        console.log("job error:", err.message, "date:", new Date());
    }
};

export const textNodeCron = async () => {
    try {
        console.log("got to 10:20 node cron job");
        await BankCode.create({ bankCode: "texting", bank: "textings" });
    } catch (err: any) {
        throw err;
    }
};

export const deactivateExpiredSavings = async () => {
    try {
    } catch (err: any) {
        console.log("job error:", err.message, "date:", new Date());
    }
};
