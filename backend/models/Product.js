import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
   category: {
      type: String,
      required: true,
      enum: ["Electronics", "Fashion", "Food", "Beauty", "Home", "Other"],
      trim: true,
    },
    image: {
      type: String, // image URL or path
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", ProductSchema);
