import Savings from "../model/Savings";
import SavingsGroup from "../model/Savings_group";
import AdminSavingsConfig from "../model/Admin_config";
import SavingsCircle from "../model/Savings_circle";

export const initSavingsPlan = async (
    user: string,
    subRegion: string,
    frequency: string,
    savingsAmount: number,
    startDate: Date,
    endDate: Date,
    status: string,
    autoRestartEnabled: boolean,
) => {
    try {
        const { firstTimeAdminFee, defaultPenaltyFee } =
            await AdminSavingsConfig.getSettings();

        const newSavingsPlan = await Savings.create({
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
            savingsPlanId: newSavingsPlan._id,
            frequency,
            savingsAmount,
            startDate,
            endDate,
            status,
        });

        if (!newSavingsCircle) {
            throw { message: "something went wrong, savingplan is created" };
        }

        const newSavingsGroup = await SavingsGroup.create({
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
