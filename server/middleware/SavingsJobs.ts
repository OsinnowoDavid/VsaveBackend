import {
    getAllActiveSavingsGroup,
    getSavingsById,
    getCircleById,
} from "../services/Savings";
import { userWithdraw, updateUserSavingsRecords } from "../services/User";
import { ISavingsCircle, ISavingsPlan } from "../../types";
import BankCode from "../model/Bank_code";
import { getDayName } from "../config/tools";

const checkPlanForUserDeduction = async (plans: any) => {
    let dateFormat = new Date();
    let todaysDate = `${(dateFormat.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${dateFormat
        .getDate()
        .toString()
        .padStart(2, "0")}/${dateFormat.getFullYear()}`;
    for (const plan of plans) {
        const savingsDetails = (await getCircleById(
            plan.savingsCircleId,
        )) as ISavingsCircle;
        let remark = `${savingsDetails?.savingsAmount}N is withdrawn from your account for ${savingsDetails?.savingsTitle} Plan`;
        // check and deduct based on frequency
        if (savingsDetails.frequency === "MONTHLY") {
            if (savingsDetails.deductionPeriod === todaysDate) {
                for (const user of plan.users) {
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
                    return;
                }
            }
        }

        if (savingsDetails.frequency === "WEEKLY") {
            if (savingsDetails.deductionPeriod === getDayName(todaysDate)) {
                for (const user of plan.users) {
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
                    return;
                }
            }
        }
        if (savingsDetails.frequency === "DAILY") {
            for (const user of plan.users) {
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
            return "done";
        }
    }
};
export const deductSavingsFromUser = async () => {
    try {
        console.log("got to 12:00 node cron job");
        const activePlan = await getAllActiveSavingsGroup();

        const deduction = await checkPlanForUserDeduction(activePlan);
        console.log("done:", deduction);
        return { message: "done" };
    } catch (err: any) {
        console.log("job error:", err.message, "date:", new Date());
        return;
    }
};

export const textNodeCron = async () => {
    try {
        console.log("got to 6:43 pm node cron job");
        await BankCode.create({ bankCode: "texting 6", bank: "textings 6" });
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
