import mongoose from "mongoose";

const groupsSchema = new mongoose.Schema({
    name: {
        type: String ,
        required:true
    },
    code:{
        type: String,
        required: true
    },
    team:{type: mongoose.Schema.Types.ObjectId,
                ref: "Team",},
    groupLeader:[{ type: mongoose.Schema.Types.ObjectId,
                ref: "Officer",}],
    officers:[{ type: mongoose.Schema.Types.ObjectId,
                ref: "Officer",}]
})

const groups = mongoose.model("Group", groupsSchema) ;

export default groups