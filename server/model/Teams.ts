import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subRegionSchema = new Schema(
    {
        subRegionName: {
            type: String,
            required: true,
        },
        shortCode: {
            type: String,
            required: false,
        },
        region: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Region",
            required: true,
        },
        location:{
            type:String,
            required:true
            },
        admin: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
        ],
        Officers: [{type: mongoose.Schema.Types.ObjectId, ref: "Team"}]
    },
    { timestamps: true },
);

const subRegion = mongoose.model("Team", subRegionSchema);

export default subRegion; 
