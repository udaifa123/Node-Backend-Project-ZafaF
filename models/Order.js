const mongoose = require("mongoose");

/* ================= ORDER ITEM ================= */
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  returnRequested: {
    type: Boolean,
    default: false,
  },
});

/* ================= ORDER ================= */
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    total: {
      type: Number,
      required: true,
    },

    /* ✅ PAYMENT */
    paymentMethod: {
      type: String,
      enum: ["COD", "PAYPAL"],
      default: "COD",
      required: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    paymentStatus: {
      type: String,
      default: "Pending",
    },

    status: {
      type: String,
      default: "Processing",
    },

    statusHistory: [
      {
        status: String,
        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    address: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },

    /* ✅ PAYPAL RESULT */
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
      payer_id: String,
      paypalOrderId: String,
    },

    cancellationRequested: {
  type: Boolean,
  default: false,
},

cancellationReason: {
  type: String,
},

cancellationRequestedAt: {
  type: Date,
},


    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
