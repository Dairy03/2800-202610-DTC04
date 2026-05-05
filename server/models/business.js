import { Schema, model } from "mongoose";

const businessSchema = new Schema({
  address: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    required: true,
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    required: true,
    type: String,
    minlength: 6,
  },
  open: {
    required: true,
    type: Number,
    trim: true,
  },
  close: {
    required: true,
    type: Number,
    trim: true,
  },
});

export default model("Business", businessSchema);
