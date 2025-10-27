import mongoose, { Document, Model } from "mongoose";

interface AdminConfigDocument extends Document {
    defaultPenaltyFee: string;
    firstTimeAdminFee: string;
}

// 👇 define static methods on this interface
interface AdminConfigModel extends Model<AdminConfigDocument> {
    getSettings(): Promise<AdminConfigDocument>;
    updateSettings(
        defaultPenaltyFee: string,
        firstTimeAdminFee: string,
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
    },
    { collection: "settings" },
);

adminConfigSchema.statics.getSettings = async function () {
    const settings = await this.findOne();
    if (!settings) {
        const defaultSettings = new this({
            defaultPenaltyFee: "0",
            firstTimeAdminFee: "0",
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
