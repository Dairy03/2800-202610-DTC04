const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    required: true,
    type: String,
    trim: true,
  },
  last_name: {
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
});

module.exports = mongoose.model("User", userSchema);
