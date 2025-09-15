import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AdminSchema = new Schema(
  {
    fullName: {
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
  },
  { timestamps: true }
);

const Admin = mongoose.model("Superadmin", AdminSchema);

export default Admin;
