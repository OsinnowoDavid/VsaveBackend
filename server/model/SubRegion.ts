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
            required: true,
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
        teams: [{type: mongoose.Schema.Types.ObjectId, ref: "Team"}]
    },
    { timestamps: true },
);

const subRegion = mongoose.model("Area", subRegionSchema);

export default subRegion; 
