import mongoose, { Document, Model } from "mongoose";
import fixedSavings from "./FixedSavings";

interface AdminConfigDocument extends Document {
    defaultPenaltyFee: string;
    firstTimeAdminFee: string;
    loanPenaltyFee: string;
    fixedSavingsAnualInterest: string;
    fixedSavingsPenaltyFee: string;
}

// 👇 define static methods on this interface
interface AdminConfigModel extends Model<AdminConfigDocument> {
    getSettings(): Promise<AdminConfigDocument>;
    updateSettings(
        defaultPenaltyFee: string,
        firstTimeAdminFee: string,
        loanPenaltyFee: string,
        fixedSavingsAnualInterest: string,
        fixedSavingsPenaltyFee: string,
    ): Promise<AdminConfigDocument>;
}

const adminConfigSchema = new mongoose.Schema(
    {
        defaultPenaltyFee: {
            type: String,
        },
        firstTimeAdminFee: {
            type: String,
        },
        loanPenaltyFee: {
            type: String,
        },
        fixedSavingsAnualInterest: {
            type: String,
        },
        fixedSavingsPenaltyFee: {
            type: String,
        },
    },
    { collection: "settings" },
);

adminConfigSchema.statics.getSettings = async function () {
    const settings = await this.findOne();
    if (!settings) {
        const defaultSettings = new this({
            defaultPenaltyFee: "25",
            firstTimeAdminFee: "50",
            loanPenaltyFee: "2.0",
            fixedSavingsAnualInterest: "28.0",
            fixedSavingsPenaltyFee: "0.5",
        });
        await defaultSettings.save();
        return defaultSettings;
    }
    return settings;
};
const AdminConfig = mongoose.model<AdminConfigDocument, AdminConfigModel>(
    "Admin_config",
    adminConfigSchema,
);

export default AdminConfig;
