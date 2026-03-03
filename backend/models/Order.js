const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },

    quantity: {
      type: Number,
      required: true
    },

    totalPrice: {
      type: Number,
      required: true
    },

    warehouseUsed: {
      type: String,
      enum: ["A", "B", "C"]
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "SHIPPED", "CANCELLED", "FAILED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);