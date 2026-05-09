import { Schema, model } from "mongoose";

const itemSchema = new Schema({
  name: { type: String, required: true, lowercase: true },
  ref_price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  address: { type: String, required: true },
  expiry: { type: Date, required: true },
});

export default model("Item", itemSchema);
