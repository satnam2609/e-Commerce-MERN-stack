const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        count: {
          type: Number,
        },
        color: {
          type: String,
        },
      },
    ],
    paymentIntent: {
      type: Object,
    },
    orderStatus: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Completed",
        "Cash On Delivery",
      ],
    },
    orderdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
