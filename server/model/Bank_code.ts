import mongoose from "mongoose";

const bankCodeSchema = new mongoose.Schema({
    bankCode: {
        type: String,
    },
    bank: {
        type: String,
    },
});

const bankCode = mongoose.model("bank_code", bankCodeSchema);
export default bankCode;
