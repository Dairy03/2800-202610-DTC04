import { Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";

const costFactor = 12;

const UserSchema = new Schema({
  fName: {
    required: true,
    type: String,
    trim: true,
  },
  lName: {
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
    minlength: 8,
  },
  role: { type: String, default: "user" },
  tutorial_toggle: { type: Boolean, default: true },
  cart: [
    {
      itemId: { type: Schema.Types.ObjectId, ref: "Item" },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  totalSaved: {required: true, type: Number, default: 0},
  dealsClaimed: {required: true, type: Number, default: 0},
  totalClaimed: {required: true, type: Number, default: 0},
  pendingDeals: {required: true, type: Number, default: 0},
  wastePrevented: {required: true, type: Number, default: 0},
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await hash(this.password, costFactor);
});

UserSchema.methods.comparePassword = async function (newPassword) {
  return compare(newPassword, this.password);
};

export default model("User", UserSchema);
