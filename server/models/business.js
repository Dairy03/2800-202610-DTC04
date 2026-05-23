import { Schema, model } from "mongoose";
import { getLatLongFromAddress } from "../controllers/geocode.controller.js";

const businessSchema = new Schema({
  address: {
    required: true,
    type: String,
    trim: true,
    unique: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
    },
  },
  email: {
    required: false,
    type: String,
    trim: true,
    lowercase: true,
  },
  name: {
    required: true,
    type: String,
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
    minlength: 8,
  },
  open: {
    required: false,
    type: Number,
    trim: true,
  },
  close: {
    required: false,
    type: Number,
    trim: true,
  },
  role: { type: String, default: "business" },
});

businessSchema.index({ location: "2dsphere" });

businessSchema.pre("save", async function () {
  if (!this.isModified("address")) return;
  const [lat, lng] = await getLatLongFromAddress(this.address);
  this.location = { type: "Point", coordinates: [lng, lat] };
});

export default model("Business", businessSchema);