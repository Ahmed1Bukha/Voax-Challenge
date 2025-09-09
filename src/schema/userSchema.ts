import mongoose, { model, Schema } from "mongoose";
import { UserModel } from "../models/user";
import bcrypt from "bcryptjs";

const userSchema = new Schema<UserModel>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre<UserModel>("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export const userModel = model<UserModel>("User", userSchema);
export default userSchema;
