import mongoose from "mongoose";

const terminalTransactionSchema = new mongoose.Schema({
     userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Reference to your User model
                required: true,
            },
            lottoryId:{
                type:String
            },
            type: {
                type: String,
                enum: ["deposit", "withdrawal", "transfer", "airtime", "data"],
                required: true,
            },
            amount: {
                type: Number,
                required: true,
                min: 0,
            },
            status: {
                type: String,
                enum: ["pending", "success", "failed", "reversed"],
                default: "pending",
            },
            transactionReference: {
                type: String,
                unique: true, // useful for payment gateways like Paystack, Flutterwave
                required: true,
            },
            remark: {
                type: String,
                trim: true,
            },
            from: {
                type: String,
            },
            date: {
                type: Date,
            },
},
{timestamps:true}
)

const terminalTransaction = mongoose.model("terminalTransaction", terminalTransactionSchema) ;

export default terminalTransaction