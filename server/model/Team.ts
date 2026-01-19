
import mongoose from "mongoose" ;

const teamSchema = new mongoose.Schema({
    name : {
        type:String ,
        required:true
    },
    code:{
        type:String,
        required: true 
    },
    subRegion:{type: mongoose.Schema.Types.ObjectId,
                ref: "SubRegion",},
    teamLeader :[{ type: mongoose.Schema.Types.ObjectId,
                ref: "Officer",}],
    groups:[{ type: mongoose.Schema.Types.ObjectId,
                ref: "Group",}] ,
    
})