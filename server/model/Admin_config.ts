import mongoose from "mongoose";
import { StringDecoder } from "string_decoder";

const adminConfigSchema = new mongoose.Schema({
    defaultPenaltyFee: {
        type: String,
    },
    firstTimeAdminFee: {
        type: String,
    },
});

const adminConfig = mongoose.model("Admin_config", adminConfigSchema);

export default adminConfig;
