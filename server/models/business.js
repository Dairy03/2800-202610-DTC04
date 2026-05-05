const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Business", businessSchema);
