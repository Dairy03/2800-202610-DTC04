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
    minlength: 6,
  },
  role: { type: String, default: "user" },
<<<<<<< Updated upstream
  tutorial_toggle: { type: Boolean, default: true },
=======
  tutorial_toggle: Boolean,
>>>>>>> Stashed changes
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await hash(this.password, costFactor);
});

UserSchema.methods.comparePassword = async function (newPassword) {
  return compare(newPassword, this.password);
};

export default model("User", UserSchema);
