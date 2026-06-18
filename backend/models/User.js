import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },
  password: { type: String, required: true },
  userName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },
  avatar: { type: String, default: "" },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
});

export default mongoose.model("User", UserModel);
