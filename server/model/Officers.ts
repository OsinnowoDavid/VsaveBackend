
import mongoose from "mongoose"; 

const officerSchema = new mongoose.Schema({
    firstName: {
        type: String ,
        required: true 
    },
    lastName: {
        type:String ,
        required: true 
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    role:{
        type:String,
        required:true,
        enum:["OFFICER", "GROUP LEADER", "TEAM LEADER"]
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        required: false,
    },
    referralCode: {
        type: String,
        required: true,
    },
    group: { type: mongoose.Schema.Types.ObjectId,
                ref: "Group",},
    team:{type: mongoose.Schema.Types.ObjectId,
                ref: "Team",}
})

const officer = mongoose.model("Officer", officerSchema) ;

export default officer 