import mongoose from "mongoose" ;

const terminalDetailsSchema = new mongoose.Schema({
     userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User", // Reference to your User model
                    required: true,
                },
                lottoryId:{
                    type:String,
                    required:true
                },
                terminalBalance: {
                    type:Number,
                    default:0
                },
                bonusBalance:{
                    type:Number,
                    default:0
                }
},
{timestamps:true}
)

const terminalDetails = mongoose.model("terminalDetails", terminalDetailsSchema) ;

export default terminalDetails