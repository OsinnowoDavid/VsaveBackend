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
        admin: [
            { type: mongoose.Schema.Types.ObjectId, ref: "SubRegionAdmin" },
        ],
        user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        teams: [{type: mongoose.Schema.Types.ObjectId, ref: "Team"}]
    },
    { timestamps: true },
);

const subRegion = mongoose.model("SubRegion", subRegionSchema);

export default subRegion; 
