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
      required: false,
    },
    location:{
      type:String,
      required:true
    },
    admin: [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
  },
  { timestamps: true }
);

const region = mongoose.model("Region", regionSchema);

export default region;
