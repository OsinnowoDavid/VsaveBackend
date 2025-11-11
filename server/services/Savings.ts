import Savings from "../model/Savings";
import SavingsGroup from "../model/Savings_group";
import AdminSavingsConfig from "../model/Admin_config";
import SavingsCircle from "../model/Savings_circle";
import UserSavingsRecord from "../model/User_savings_record";
import UserPersonalSavings from "../model/User_savings_circle";
import {
    ISavingsPlan,
    ISavingsGroup,
    ISavingsCircle,
    IUserSavingsRecord,
    IUser,
} from "../../types";

export const initSavingsPlan = async (
    user: string,
    subRegion: string,
    savingsTitle: string,
    frequency: string,
    savingsAmount: number,
    startDate: Date,
    endDate: Date,
    status: string,
    autoRestartEnabled: boolean,
    deductionPeriod: string,
    duration: number,
    maturityAmount: number,
) => {
    try {
        const { firstTimeAdminFee, defaultPenaltyFee } =
            await AdminSavingsConfig.getSettings();

        const newSavingsPlan = await Savings.create({
            savingsTitle,
            subRegion,
            frequency,
            savingsAmount,
            firstTimeAdminFee,
            autoRestartEnabled,
            status,
            adminID: user,
        });
        if (!newSavingsPlan) {
            throw { message: "something went wrong" };
        }
        const newSavingsCircle = await SavingsCircle.create({
            subRegion,
            savingsTitle,
            savingsPlanId: newSavingsPlan._id,
            frequency,
            savingsAmount,
            startDate,
            endDate,
            duration,
            status,
            deductionPeriod,
            maturityAmount,
        });

        if (!newSavingsCircle) {
            throw { message: "something went wrong, savingplan is created" };
        }

        const newSavingsGroup = await SavingsGroup.create({
            subRegion,
            status,
            duration,
            savingsId: newSavingsPlan._id,
            savingsCircleId: newSavingsCircle._id,
        });

        if (!newSavingsGroup) {
            throw {
                message:
                    "something went wrong , savingsPlan and savingCircle is created",
            };
        }

        let data = {
            savingsPlanId: newSavingsPlan._id,
            savingsCircleId: newSavingsCircle._id,
            frequency,
            savingsAmount,
            startDate,
            endDate,
            status,
        };
        return data;
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

export const getSavingsById = async (id: string) => {
    try {
        const foundSavings = await Savings.findById(id);
        return foundSavings;
    } catch (err: any) {
        throw err;
    }
};

export const getAllSavingsPlan = async () => {
    try {
        const allSavingsPlan = await Savings.find();
        return allSavingsPlan;
    } catch (err: any) {
        throw err;
    }
};

export const getAllActiveSavingsPlan = async () => {
    try {
        const allActiveSavingsPlan = await Savings.find({ status: "ACTIVE" });
        return allActiveSavingsPlan;
    } catch (err: any) {
        throw err;
    }
};

export const getAllActiveSavingsPlanCircle = async () => {
    try {
        const allActiveCircle = await SavingsCircle.find({ status: "ACTIVE" });
        return allActiveCircle;
    } catch (err: any) {
        throw err;
    }
};
export const getAllSavingsPlanCircle = async (savingsPlanId: string) => {
    try {
        const allSavingsCircle = await SavingsCircle.find({ savingsPlanId });
        return allSavingsCircle;
    } catch (err: any) {
        throw err;
    }
};
export const getCurrentActiveSavingsCircle = async (savingsPlanId: string) => {
    try {
        const currentActiveCircle = await SavingsCircle.findOne({
            savingsPlanId,
            status: "ACTIVE",
        });
        return currentActiveCircle;
    } catch (err: any) {
        throw err;
    }
};
export const getAllActiveSavingsGroup = async () => {
    try {
        const allActiveSavingGroup = await SavingsGroup.find({
            status: "ACTIVE",
        });
        return allActiveSavingGroup;
    } catch (err: any) {
        throw err;
    }
};

export const getSavingsGroupByCircleId = async (circleId: string) => {
    try {
        const savingsGroup = await SavingsGroup.findOne({
            savingsCircleId: circleId,
        });
        return savingsGroup;
    } catch (err: any) {
        throw err;
    }
};

export const getActiveSavingsGroupByCircleId = async (circleId: string) => {
    try {
        const savingsGroup = await SavingsGroup.findOne({
            savingsCircleId: circleId,
            status: "ACTIVE",
        });
        return savingsGroup;
    } catch (err: any) {
        throw err;
    }
};

export const endSavings = async (savingsId: string) => {
    try {
        // end savings group
        const foundSavingsGroup = (await SavingsGroup.findOne({
            savingsId,
        })) as ISavingsGroup;
        foundSavingsGroup.status = "ENDED";
        await foundSavingsGroup.save();
        //also end savings circle
        const foundCircle = (await SavingsCircle.findOne({
            savingsPlanId: savingsId,
            status: "ACTIVE",
        })) as ISavingsCircle;
        foundCircle.status = "ENDED";
        await foundCircle.save();
        //also end savings plan
        const foundSavingsPlan = (await Savings.findById(
            savingsId,
        )) as ISavingsPlan;
        foundSavingsPlan.status = "ENDED";
        await foundSavingsPlan.save();
        // lastly end userSavingsRecord
        const foundUserSavingsRecord = (await UserSavingsRecord.findOne({
            savingsId,
            status: "ACTIVE",
        })) as IUserSavingsRecord;
        foundUserSavingsRecord.status = "ENDED";
        await foundUserSavingsRecord.save();
        return foundSavingsPlan;
    } catch (err: any) {
        throw err;
    }
};

export const renewSavingsCircle = async (savingsId: string) => {
    try {
        // end savings group
        const foundSavingsGroup = (await SavingsGroup.findOne({
            savingsId,
        })) as ISavingsGroup;
        foundSavingsGroup.status = "ENDED";
        await foundSavingsGroup.save();
        //also end savings circle
        const foundCircle = (await SavingsCircle.findOne({
            savingsPlanId: savingsId,
        })) as ISavingsCircle;
        foundCircle.status = "ENDED";
        await foundCircle.save();
        // also end user
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
    startDate: Date,
    endDate: Date,
    status: string,
    maturityAmount: number,
    autoRestartEnabled: boolean,
) => {
    try {
        const { firstTimeAdminFee } = await AdminSavingsConfig.getSettings();
        const newSavingsCircle = await UserPersonalSavings.create({
            user,
            savingsTitle,
            frequency,
            duration,
            deductionPeriod,
            firstTimeAdminFee,
            savingsAmount,
            startDate,
            endDate,
            status,
            autoRestartEnabled,
            maturityAmount,
        });

        const newSavingsRecord = await UserSavingsRecord.create({
            user,
            savingsCircleId: newSavingsCircle._id,
            maturityAmount,
            status,
        });
        return { newSavingsCircle, newSavingsRecord };
    } catch (err: any) {
        throw err;
    }
};
