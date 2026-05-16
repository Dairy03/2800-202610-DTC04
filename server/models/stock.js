import { Schema, model, Types } from "mongoose";

const stockSchema = new Schema({
  business: { type: Types.ObjectId, ref: "Business" },
  items: {
    type: Map,
    of: { type: Types.ObjectId, ref: "Item" },
  },
});

export default model("Stock", stockSchema);
