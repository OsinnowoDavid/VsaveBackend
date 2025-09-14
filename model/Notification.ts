import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});
