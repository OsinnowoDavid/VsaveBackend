import mongoose from "mongoose"; 

const beneficiariesSchema = new mongoose.Schema({
    user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
    beneficiaryName: {

    },
})