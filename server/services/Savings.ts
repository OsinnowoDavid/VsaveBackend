import AdminSavingsConfig from "../model/Admin_config";
import SavingsCircle from "../model/Savings_circle";
import UserSavingsRecord from "../model/User_savings_record";
import UserPersonalSavings from "../model/User_savings_circle";
import SavingsContribution from "../model/SavingsContribution";
import FixedSavings from "../model/FixedSavings";
import Loan from "../model/Loan";
import {
    ISavingsPlan,
    ISavingsGroup,
    ISavingsCircle,
    IUserSavingsRecord,
    IUser,
} from "../../types";
import {
    calculateEndDate,
    generateSavingsRefrenceCode,
    checkIfContributionIsCompleted,
} from "../config/tools";
import { userDeposit, userWithdraw } from "./User";
const generateCircleId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }

    return code;
};
export const initSavingsPlan = async (
    user: string,
    subRegion: string,
    savingsTitle: string,
    frequency: string,
    savingsAmount: number,
    status: string,
    deductionPeriod: string,
    duration: number,
    maturityAmount: number,
) => {
    try {
        const newSavingsCircle = await SavingsCircle.create({
            subRegion,
            savingsTitle,
            frequency,
            duration,
            deductionPeriod,
            savingsAmount,
            circleId: generateCircleId(),
            status,
            maturityAmount,
            adminId: user,
        });
        return newSavingsCircle;
    } catch (err: any) {
        throw err;
    }
};

export const getCircleById = async (id: string) => {
    try {
        const foundCircle = await SavingsCircle.findById(id);
        return foundCircle;
    } catch (err: any) {
        throw err;
    }
};

export const getAllActiveSavingsCircle = async (subRegion: string) => {
    try {
        const allActiveCircle = await SavingsCircle.find({
            status: "ACTIVE",
            subRegion,
        });
        return allActiveCircle;
    } catch (err: any) {
        throw err;
    }
};
export const getAllSavingsCircle = async () => {
    try {
        const allSavingsCircle = await SavingsCircle.find();
        return allSavingsCircle;
    } catch (err: any) {
        throw err;
    }
};
export const createUserPersonalSavings = async (
    user: IUser,
    savingsTitle: string,
    frequency: string,
    duration: string,
    deductionPeriod: string,
    savingsAmount: string,
    maturityAmount: number,
    startDate: Date,
    endDate: Date,
    autoRestartEnabled: boolean,
) => {
    try {
        const newSavingsCircle = await UserPersonalSavings.create({
            user,
            savingsTitle,
            frequency,
            duration,
            deductionPeriod,
            savingsAmount,
            circleId: generateCircleId(),
            maturityAmount,
        });

        const newSavingsRecord = (await UserSavingsRecord.create({
            user,
            savingsCircleId: newSavingsCircle._id,
            duration,
            startDate,
            endDate,
            maturityAmount,
            status: "PAUSED",
            autoRestartEnabled,
        })) as IUserSavingsRecord;
        const newSavingsContribution = await SavingsContribution.create({
            user,
            savingsRecordId: newSavingsRecord._id,
        });
        newSavingsRecord.contributionId = newSavingsContribution._id;
        await newSavingsRecord.save();
        return {
            newSavingsCircle,
            newSavingsRecord,
            newSavingsContribution,
        };
    } catch (err: any) {
        throw err;
    }
};

export const getUserSavingsCircleById = async (circleId: string) => {
    try {
        const foundUserSavingsCircle = await UserPersonalSavings.findById(
            circleId,
        );
        return foundUserSavingsCircle;
    } catch (err: any) {
        throw err;
    }
};
export const getUserSavingsRecordById = async (id: string) => {
    try {
        const foundRecord = await UserSavingsRecord.findById(id);
        return foundRecord;
    } catch (err: any) {
        throw err;
    }
};

export const joinSavings = async (
    user: IUser,
    circleId: string,
    autoRestartEnabled: boolean,
    startDate: Date,
    endDate: Date,
    status: string,
) => {
    try {
        const foundSavingsCircle = await SavingsCircle.findById(circleId);
        const newSavingsRecord = (await UserSavingsRecord.create({
            user: user._id,
            savingsCircleId: foundSavingsCircle._id,
            duration: foundSavingsCircle.duration,
            startDate,
            endDate,
            maturityAmount: foundSavingsCircle.maturityAmount,
            status,
            autoRestartEnabled,
        })) as IUserSavingsRecord;
        const newSavingsContribution = await SavingsContribution.create({
            user: user._id,
            savingsRecordId: newSavingsRecord._id,
        });
        newSavingsRecord.contributionId = newSavingsContribution._id;
        await newSavingsRecord.save();
        return {
            newSavingsRecord,
            newSavingsContribution,
        };
    } catch (err: any) {
        throw err;
    }
};
export const getAllUserSavingsCircle = async (user: IUser) => {
    try {
        const foundSavingsCircle = await UserPersonalSavings.find({
            user: user._id,
        });
        return foundSavingsCircle;
    } catch (err: any) {
        throw err;
    }
};
export const getUserActiveSavingsRecord = async (user: IUser) => {
    try {
        const foundUserSavingsRecord = await UserSavingsRecord.find({
            user: user._id,
            status: "ACTIVE",
        });
        return foundUserSavingsRecord;
    } catch (err: any) {
        throw err;
    }
};
export const getUserPausedSavingsRecord = async (user: IUser) => {
    try {
        const foundUserSavingsRecord = UserSavingsRecord.find({
            user: user._id,
            status: "PAUSED",
        });
        return foundUserSavingsRecord;
    } catch (err: any) {
        throw err;
    }
};
export const getAllUserPausedSavingsRecord = async () => {
    try {
        const allPausedSavingsRecord = await UserSavingsRecord.find({
            status: "PAUSED",
        });
        return allPausedSavingsRecord;
    } catch (err: any) {
        throw err;
    }
};

export const getAllUserActiveSavingsRecord = async () => {
    try {
        const allActiveSavingsRecord = await UserSavingsRecord.find({
            status: "ACTIVE",
        });
        return allActiveSavingsRecord;
    } catch (err: any) {
        throw err;
    }
};
const getTomorrowsDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
};

export const restartSavingsCircle = async (user: string, circleId: string) => {
    try {
        const foundSavingsCircle = await SavingsCircle.findById(circleId);
        let startDate = getTomorrowsDate();
        let endDate = calculateEndDate(
            foundSavingsCircle.frequency,
            startDate,
            foundSavingsCircle.duration,
        );
        const newSavingsRecord = (await UserSavingsRecord.create({
            user: user,
            savingsCircleId: foundSavingsCircle._id,
            duration: foundSavingsCircle.duration,
            startDate,
            endDate,
            maturityAmount: foundSavingsCircle.maturityAmount,
            status: "PAUSED",
            autoRestartEnabled: true,
        })) as IUserSavingsRecord;
        const newSavingsContribution = await SavingsContribution.create({
            user: user,
            savingsRecordId: newSavingsRecord._id,
        });
        newSavingsRecord.contributionId = newSavingsContribution._id;
        await newSavingsRecord.save();
        return {
            newSavingsRecord,
            newSavingsContribution,
        };
    } catch (err: any) {
        throw err;
    }
};

export const updateSavingsAutoRenewStatus = async (
    user: IUser,
    savingsRecordId: string,
    autoRenewStatus: boolean,
) => {
    try {
        const foundRecord = (await UserSavingsRecord.findOne({
            _id: savingsRecordId,
            user: user._id,
        })) as IUserSavingsRecord;

        foundRecord.autoRestartEnabled = autoRenewStatus;
        await foundRecord.save();
        return foundRecord;
    } catch (err: any) {
        throw err;
    }
};
export const checkForCircleById = async (circleId: string) => {
    try {
        let result = {} as any;
        const foundAdminCircle = await SavingsCircle.findById(circleId);
        const foundUserCircle = await UserPersonalSavings.findById(circleId);
        if (foundAdminCircle) {
            result = foundAdminCircle;
        }
        if (foundUserCircle) {
            result = foundUserCircle;
        }
        return result;
    } catch (err: any) {
        throw err;
    }
};
export const savingsDeductionSchedule = async (
    savingsRecordId: string,
    amount: number,
    withdrawStatus: boolean,
) => {
    try {
        // update user savings record first
        const foundSavingsRecord = await UserSavingsRecord.findById(
            savingsRecordId,
        );
        foundSavingsRecord.period = foundSavingsRecord.period + 1;
        await foundSavingsRecord.save();
        if (withdrawStatus) {
            const foundContribution = await SavingsContribution.findById(
                foundSavingsRecord.contributionId,
            );
            console.log("period:", foundSavingsRecord.period);
            if (Number(foundSavingsRecord.period) === 1) {
                const { firstTimeAdminFee } =
                    await AdminSavingsConfig.getSettings();
                //deduct Admin fee
                let adminFeeAmount = (amount * Number(firstTimeAdminFee)) / 100;
                let record = {
                    periodIndex: foundSavingsRecord.period,
                    amount: amount - Number(adminFeeAmount),
                    status: "paid",
                };
                foundContribution.adminFirstTimeFee = adminFeeAmount;
                foundContribution.record.push(record);
                await foundSavingsRecord.save();
                await foundContribution.save();
                return {
                    foundSavingsRecord,
                    foundContribution,
                };
            }
            let record = {
                periodIndex: foundSavingsRecord.period,
                amount,
                status: "paid",
            };
            foundContribution.record.push(record);
            await foundContribution.save();
            return {
                foundSavingsRecord,
                foundContribution,
            };
        }
        const foundContribution = await SavingsContribution.findById(
            foundSavingsRecord.contributionId,
        );
        let record = {
            periodIndex: foundSavingsRecord.period,
            amount,
            status: "pending",
        };
        foundContribution.record.push(record);
        await foundContribution.save();
        return {
            foundSavingsRecord,
            foundContribution,
        };
    } catch (err: any) {
        throw err;
    }
};

export const allUserActiveSavingsRecord = async (user: IUser) => {
    try {
        const allActiveRecord = await UserSavingsRecord.find({
            user: user._id,
            status: "ACTIVE",
        });
        return allActiveRecord;
    } catch (err: any) {
        throw err;
    }
};

export const getSavingsContributionById = async (contributionId: string) => {
    try {
        const foundSavingsContribution = await SavingsContribution.findById(
            contributionId,
        );
        return foundSavingsContribution;
    } catch (err: any) {
        throw err;
    }
};

export const userSavingsRecords = async (user: IUser) => {
    try {
        const allSavingsRecords = await UserSavingsRecord.find({
            user: user._id,
        });
        return allSavingsRecords;
    } catch (err: any) {
        throw err;
    }
};
export const getAllContributionStatus = async (contributionId: string) => {
    try {
        const foundRecord = await SavingsContribution.findById(contributionId);
        let result = [] as any;
        for (const record of foundRecord.record) {
            result.push(record.status);
        }
        return result;
    } catch (err: any) {
        throw err;
    }
};

export const latePaymentDeduction = async (user: IUser) => {
    try {
        const { defaultPenaltyFee, firstTimeAdminFee } =
            await AdminSavingsConfig.getSettings();
        const foundSavingsContribution = await SavingsContribution.find({
            user: user._id,
        });
        for (const contributionRecord of foundSavingsContribution) {
            // check record array for pending payment
            for (const record of contributionRecord.record) {
                if (record.status === "pending") {
                    // check if its the first index  so as to deduct admin first time fee
                    if (record.periodIndex === 1) {
                        let amount = record.amount + Number(defaultPenaltyFee);
                        let adminFeeAmount =
                            (record.amount * Number(firstTimeAdminFee)) / 100;
                        let remark = `savings late repayment deduction record : ${contributionRecord._id}`;
                        const withdraw = await userWithdraw(
                            contributionRecord.user.toString(),
                            amount,
                            remark,
                        );
                        if (withdraw === "Insufficient Funds") {
                            record.status = "pending";
                            return;
                        }
                        record.status = "paid";
                        return;
                    }
                    let amount = record.amount + Number(defaultPenaltyFee);
                    let remark = `savings late repayment deduction record : ${contributionRecord._id}`;
                    const withdraw = await userWithdraw(
                        contributionRecord.user.toString(),
                        amount,
                        remark,
                    );
                    if (withdraw === "Insufficient Funds") {
                        record.status = "pending";
                        return;
                    }
                    record.status = "paid";
                    return;
                }
            }
            await contributionRecord.save();
            return;
        }
    } catch (err: any) {
        throw err;
    }
};

export const havePendingLoanAndSaVingsStatus = async (user: string) => {
    try {
        const foundLoanRecord = await Loan.find({ user, isSettled: false });
        const foundSavingsRecord = await UserSavingsRecord.find({
            user,
            status: "ACTIVE",
        });
        let result = {
            loanStatus: false,
            savingsStatus: false,
        };
        if (foundLoanRecord.length > 0) {
            result.loanStatus = true;
        }
        for (const savingsRecord of foundSavingsRecord) {
            const foundContribution = await SavingsContribution.findById(
                savingsRecord._id,
            );
            const allStatus = await getAllContributionStatus(
                foundContribution._id.toString(),
            );
            const isCompleted = checkIfContributionIsCompleted(allStatus);
            if (!isCompleted) {
                result.savingsStatus = true;
            }
        }
        return result;
    } catch (err: any) {
        throw err;
    }
};

export const disburseSavings = async (savingsRecordId: string) => {
    try {
        const foundRecord = await UserSavingsRecord.findById(savingsRecordId);
        const foundContribution = await SavingsContribution.findById(
            foundRecord.contributionId,
        );
        let ref = generateSavingsRefrenceCode();
        let remark = `savings disbursement , savings circle is completed, and ${foundRecord.maturityAmount} is been deposited`;
        const deposit = await userDeposit(
            foundRecord.user.toString(),
            foundRecord.maturityAmount,
            ref,
            new Date(),
            "Vsave savings",
            remark,
        );
        // update savings record and contribution
        foundRecord.payOutDate = new Date();
        foundRecord.payOutStatus = true;
        foundRecord.status = "ENDED";
        await foundRecord.save();
        return {
            userRecord: foundRecord,
            userContribution: foundContribution,
        };
    } catch (err: any) {
        throw err;
    }
};

export const getUserActiveFixedSavings = async (user: IUser) => {
    try {
        const activeRecord = await FixedSavings.find({
            user: user._id,
            status: "active",
        });
        return activeRecord;
    } catch (err: any) {
        throw err;
    }
};
export const getUserCompletedFixedSavings = async (user: IUser) => {
    try {
        const completedRecord = await FixedSavings.find({
            user: user._id,
            status: "completed",
        });
        return completedRecord;
    } catch (err: any) {
        throw err;
    }
};

export const getUserFixedSavings = async (user: IUser) => {
    try {
        const allRecord = await FixedSavings.find({
            user: user._id,
        });
        return allRecord;
    } catch (err: any) {
        throw err;
    }
};
export const getAllActiveFixedSavings = async () => {
    try {
        const foundRecord = await FixedSavings.find({
            status: "active",
        });
        return foundRecord;
    } catch (err: any) {
        throw err;
    }
};
