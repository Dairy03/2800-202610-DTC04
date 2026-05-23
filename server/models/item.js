import { Schema, model, Types } from "mongoose";

const itemSchema = new Schema({
  name: { type: String, required: true, lowercase: true },
  ref_price: { type: Number, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 0 },
  business: { type: Types.ObjectId, ref: "Business" },
  group: { type: String, required: false, lowecase: true },
  expiry: { type: Date, required: true },
  weight_kg: { type: Number, required: true, min: 0 },
});

export default model("Item", itemSchema);
