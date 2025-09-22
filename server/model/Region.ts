import mongoose from "mongoose";

const Schema = mongoose.Schema;

const regionSchema = new Schema(
  {
    regionName: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
    },
    admin: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
    agents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Agent" }],
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const region = mongoose.model("Region", regionSchema);

export default region;
