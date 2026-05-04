const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  ref_price: Double,
  quantity: Number,
  location: String,
  expiry: Date,
});

module.exports = mongoose.model("Item", itemSchema);
