import {
    getAllUserPausedSavingsRecord,
    getAllUserActiveSavingsRecord,
    restartSavingsCircle,
    checkForCircleById,
    savingsDeductionSchedule,
    getAllContributionStatus,
    disburseSavings,
    getAllActiveFixedSavings,
} from "../services/Savings";
import { userWithdraw, userDeposit } from "../services/User";
import {
    getDayName,
    isPastYesterday,
    isPastTomorrow,
    checkIfContributionIsCompleted,
    getCurrentDateWithClosestHour,
    generateSavingsRefrenceCode,
} from "../config/tools";
import { getAdminSavingsConfig } from "../services/Admin";
export const startPauseSavings = async () => {
    try {
        const allPausedSavings = await getAllUserPausedSavingsRecord();

        // Get today's date normalized to local midnight
        let todaysDate = new Date();
        todaysDate.setHours(0, 0, 0, 0);

        for (const record of allPausedSavings) {
            // Convert MongoDB UTC date → local date
            let startDate = new Date(record.startDate);
            startDate.setHours(0, 0, 0, 0); // Normalize to local midnight

            console.log(
                "Local Today:",
                todaysDate.getTime(),
                "Record Start:",
                startDate.getTime(),
            );

            // Compare by timestamp, not ===
            if (startDate.getTime() === todaysDate.getTime()) {
                console.log("got here start paused");
                record.status = "ACTIVE";
                await record.save();
            }
            console.log("start paused record status:", record);
        }

        return "Done";
    } catch (err: any) {
        throw err;
    }
};

export const endExpiredSavings = async () => {
    try {
        // check for expired record that needs to end
        const allActiveSavings = await getAllUserActiveSavingsRecord();
        for (const record of allActiveSavings) {
            let pastTomorrow = isPastTomorrow(record.endDate);
            console.log(
                "ispasttomorrow",
                pastTomorrow,
                "the end date",
                record.endDate,
            );
            if (pastTomorrow === true) {
                console.log("got here end expired");
                // check if the contribution is completed
                const allStatus = await getAllContributionStatus(
                    record.contributionId.toString(),
                );
                const isCompleted = checkIfContributionIsCompleted(allStatus);
                if (isCompleted) {
                    console.log("got here iscompleted expirering", record);
                    record.status = "ENDED";
                    await record.save();
                    // first check if autorenew is on do user can start a new circle
                    if (record.autoRestartEnabled) {
                        await restartSavingsCircle(
                            record.user.toString(),
                            record.savingsCircleId.toString(),
                        );
                    }
                    console.log("expire record status after:", record);
                    return;
                }
            }
        }
        return "Done";
    } catch (err: any) {
        throw err;
    }
};

export const deductSavingsFromUser = async () => {
    try {
        let todaysDate = new Date();
        // first get all active record first
        const allActiveSavings = await getAllUserActiveSavingsRecord();
        for (const record of allActiveSavings) {
            const savingsDetails = await checkForCircleById(
                record.savingsCircleId.toString(),
            );
            let remark = `${savingsDetails?.savingsAmount}N is withdrawn from your account for ${savingsDetails?.savingsTitle} Plan`;
            // check and deduct based on frequency
            if (savingsDetails.frequency === "MONTHLY") {
                if (
                    new Date(savingsDetails.deductionPeriod).getTime() ===
                    todaysDate.getTime()
                ) {
                    const withdraw = await userWithdraw(
                        record.user.toString(),
                        savingsDetails.savingsAmount,
                        remark,
                    );
                    if (withdraw === "Insufficient Funds") {
                        await savingsDeductionSchedule(
                            record._id.toString(),
                            savingsDetails.savingsAmount,
                            false,
                        );
                    }
                    await savingsDeductionSchedule(
                        record._id.toString(),
                        savingsDetails.savingsAmount,
                        true,
                    );
                    return;
                }
            }
            if (savingsDetails.frequency === "WEEKLY") {
                if (savingsDetails.deductionPeriod === getDayName(todaysDate)) {
                    const withdraw = await userWithdraw(
                        record.user.toString(),
                        savingsDetails.savingsAmount,
                        remark,
                    );
                    if (withdraw === "Insufficient Funds") {
                        await savingsDeductionSchedule(
                            record._id.toString(),
                            savingsDetails.savingsAmount,
                            false,
                        );
                    }
                    await savingsDeductionSchedule(
                        record._id.toString(),
                        savingsDetails.savingsAmount,
                        true,
                    );
                }
            }

            if (savingsDetails.frequency === "DAILY") {
                const withdraw = await userWithdraw(
                    record.user.toString(),
                    savingsDetails.savingsAmount,
                    remark,
                );
                if (withdraw === "Insufficient Funds") {
                    await savingsDeductionSchedule(
                        record._id.toString(),
                        savingsDetails.savingsAmount,
                        false,
                    );
                }
                await savingsDeductionSchedule(
                    record._id.toString(),
                    savingsDetails.savingsAmount,
                    true,
                );
            }
        }
        return "Done";
    } catch (err: any) {
        throw err;
    }
};

export const savingsDisbursement = async () => {
    try {
        //get all acttive user savings record
        const allActiveSavings = await getAllUserActiveSavingsRecord();
        for (const record of allActiveSavings) {
            // check if its past  endDate
            let PastEndDate = isPastYesterday(record.endDate);
            if (PastEndDate) {
                // check if the contribution is completed
                const allStatus = await getAllContributionStatus(
                    record.contributionId.toString(),
                );
                const isCompleted = checkIfContributionIsCompleted(allStatus);
                if (isCompleted) {
                    await disburseSavings(record._id.toString());
                }
            }
            return "done";
        }
    } catch (err: any) {
        throw err;
    }
};

export const fixedSavingsDisbursement = async () => {
    try {
        const allActiveSavings = await getAllActiveFixedSavings();
        for (const record of allActiveSavings) {
            if (
                getCurrentDateWithClosestHour().getTime() ===
                record.endDate.getTime()
            ) {
                // deposite user account with payment amount
                let ref = generateSavingsRefrenceCode();
                let remark = `Fixed savings maturity payout`;
                const deposit = await userDeposit(
                    record.user.toString(),
                    record.paymentAmount,
                    ref,
                    new Date(),
                    "Vsave",
                    remark,
                );
                record.status = "completed";
                await record.save();
                return "Done";
            }
        }
        return "Done";
    } catch (err: any) {
        throw err;
    }
};
