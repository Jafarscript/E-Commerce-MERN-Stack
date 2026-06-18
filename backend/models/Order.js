import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, required: true },
        quantity: {
          type: Number,
          required: true,
        },
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
      required: true,
    },
    paystackReference: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Order", OrderSchema);
