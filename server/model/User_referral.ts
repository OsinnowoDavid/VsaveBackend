import mongoose from "mongoose";

const userReferralSchema = new mongoose.Schema({
    user:  {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Reference to your User model
                required: true,
            },
    bonusAmount:{
        type:Number ,
    },
    status:{
        type:String,
        enum:["pending","completed", "rejected"]
    },
    referredUser:{
         type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Reference to your User model
                required: true,
    },
    referredUserTask:{
         fundVSaveWallet: {
            type:Boolean,
            default: false
         },
          createSavingsPlan: {
            type:Boolean,
            default: false
         },
        complete5SuccessfulSavingsCircle: {
            type:Boolean,
            default: false
         },
    }
},
{timestamps:true}
)

const userReferral = mongoose.model("user_referral", userReferralSchema) ;

export default userReferral