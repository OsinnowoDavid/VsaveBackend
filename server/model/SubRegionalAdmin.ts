import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subRegionalAdminSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: false,
    },
    subRegion: { type: mongoose.Schema.Types.ObjectId, ref: "SubRegion", required: true },
  },
  { timestamps: true }
);

const subRegionalAdmin = mongoose.model(
  "SubRegionalAdmin",
  subRegionalAdminSchema
);

export default subRegionalAdmin;
