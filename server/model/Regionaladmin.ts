import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AdminSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    middlename: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String,
      required: false,
    },
    region: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Regionaladmin", AdminSchema);

export default Admin;
