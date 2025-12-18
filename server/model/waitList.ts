import mongoose from "mongoose"; 

const waitListSchema = new mongoose.Schema({
    fullName: {
        type:String,
        required:true
    },
    email:{
         type:String,
        required:true
    },
    phoneNumber:{
         type:String,
        required:true
    },
    interest:{
         type:String,
        required:true
    }
}) 

const waitList = mongoose.model("waitlist", waitListSchema) ;

export default waitList 