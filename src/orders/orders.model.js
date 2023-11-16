const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    customerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: { address: String, coordonates: { lat: Number, long: Number } },
      required: true,
    },
    deliveryPersonId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: false,
    },
    content: {
      type: [
        {
          name: String,
          price: Number,
          photo: String,
          quantity: Number,
        },
      ],
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "FREE",
        "ORDER_PREPARATION",
        "READY",
        "PENDING_DELIVERY",
        "DELIVERED",
        "CANCELED",
      ],
      default: "FREE",
      required: true,
    },
    code: {
      type: String,
      required: false,
    },
  },
  { timestamps: true, strictPopulate: false }
);

const OrderModel = model("Order", orderSchema);

module.exports = OrderModel;
