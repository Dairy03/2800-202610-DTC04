import { Schema, model } from "mongoose";

const businessSchema = new Schema({
  address: {
    required: false, // TESTING
    type: String,
    trim: true,
  },
  email: {
    required: false, // TESTING
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
    required: false, // TESTING
    type: Number,
    trim: true,
  },
  close: {
    required: false, // TESTING
    type: Number,
    trim: true,
  },
  role: { type: String, default: 'business' },
});

export default model("Business", businessSchema);
