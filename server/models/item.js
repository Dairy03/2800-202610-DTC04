const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true },
  ref_price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  address: { type: String, required: true },
  expiry: { type: Date, required: true },
});

module.exports = mongoose.model("Item", itemSchema);
