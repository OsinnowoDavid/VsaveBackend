import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true ,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:String
    },
    password:{
        type:String,
    },
    isEmailVerified: {
            type: Boolean,
            default: false,
        },
    role:{
        type:String,
        enum:["SUPER ADMIN","REGIONAL ADMIN","SUBREGIONAL ADMIN"],
        required:true,
    },
    region:[String],
    subRegion:[String],
    profilePicture: {
      type: String
    },
    verificationCode:{
        type:Number
    }
},
{timestamps:true}
)

const Admin = mongoose.model("Admin", AdminSchema)

export default Admin