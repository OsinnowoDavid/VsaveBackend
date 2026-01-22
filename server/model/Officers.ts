
import mongoose from "mongoose"; 
import VerificationToken from "./VerificationToken";

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
    level:{
        type:String
    },
    password: {
        type: String,
    },
    profilePicture: {
        type: String,
        required: false,
    },
    referralCode: {
        type: String,
        required: true,
    },
    area:{type: mongoose.Schema.Types.ObjectId,
                ref: "Area",},
    VerificationToken:{
        type:Number
    }
})

const officer = mongoose.model("Officer", officerSchema) ;

export default officer 