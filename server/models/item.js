import { Schema, model, Types } from "mongoose";

const itemSchema = new Schema({
  name: { type: String, required: true, lowercase: true },
  ref_price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 0 },
  address: { type: String, required: true },
  business: { type: Types.ObjectId, ref: "Item" },
  expiry: { type: Date, required: true },
});

export default model("Item", itemSchema);
