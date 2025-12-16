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
        required:true
    },
    role:{
        type:String,
        enum:["SUPER ADMIN","REGIONAL ADMIN","SUBREGIONAL ADMIN"],
        required:true,
    },
    region:{
        type:String
    },
    subRegion:{
        type:String
    },
    profilePicture: {
      type: String
    }
})

const Admin = mongoose.model("Admin", AdminSchema)

export default Admin