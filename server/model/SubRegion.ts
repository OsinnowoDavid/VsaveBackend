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
    admin: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubRegionAdmin" }],
    agent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Agent" }],
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const subRegion = mongoose.model("SubRegion", subRegionSchema);

export default subRegion;
