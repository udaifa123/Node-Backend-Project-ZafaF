const Order = require("../models/Order");
const Cart = require("../models/Cart");

/* ================= CREATE ORDER ================= */
exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
const order = await Order.create({
  user: req.user._id,
  items: cart.items.map(i => ({
    product: i.product._id,
    quantity: i.quantity,
  })),
  total,
  address: req.body.address,

  paymentMethod: req.body.paymentMethod
    ? req.body.paymentMethod.toUpperCase()
    : "COD",

  paymentStatus: "Pending",
  isPaid: false,

  status: "Processing",
  statusHistory: [{ status: "Processing" }],
});



    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

/* ================= GET USER ORDERS ================= */
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
      isDeleted: false,
    })
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ================= CANCEL ORDER ================= */
/* ================= CANCEL ORDER (TIME LIMITED) ================= */
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Status check
    if (order.status !== "Processing") {
      return res
        .status(400)
        .json({ message: "Order cannot be canceled now" });
    }

    /* ⏱️ TIME LIMIT (30 minutes) */
    const CANCEL_LIMIT_MINUTES = 30;

    const createdTime = new Date(order.createdAt).getTime();
    const currentTime = Date.now();

    const diffMinutes =
      (currentTime - createdTime) / (1000 * 60);

    if (diffMinutes > CANCEL_LIMIT_MINUTES) {
      return res.status(400).json({
        message: `Order can be canceled only within ${CANCEL_LIMIT_MINUTES} minutes`,
      });
    }

    // ✅ Cancel order
    order.status = "Canceled";
    order.statusHistory.push({ status: "Canceled" });

    await order.save();

    res.json({ message: "Order canceled successfully" });
  } catch (err) {
    console.error("CANCEL ORDER ERROR:", err);
    res.status(500).json({ message: "Cancel failed" });
  }
};


/* ================= CLEAR CANCELED ORDERS (SOFT) ================= */
exports.clearCanceledOrders = async (req, res) => {
  try {
    await Order.updateMany(
      { user: req.user._id, status: "Canceled" },
      { isDeleted: true }
    );

    res.json({ message: "Canceled orders cleared successfully" });
  } catch (err) {
    console.error("CLEAR CANCELED ERROR:", err);
    res.status(500).json({ message: "Failed to clear canceled orders" });
  }
};


/* ================= RETURN ORDER ================= */
exports.requestReturn = async (req, res) => {
  try {
    const { orderId, items, reason } = req.body;

    if (!orderId || !items?.length || !reason) {
      return res.status(400).json({ message: "Invalid return data" });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      isDeleted: false,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Allow return only if Delivered
    if (order.status !== "Delivered") {
      return res.status(400).json({
        message: "Only delivered orders can be returned",
      });
    }

    // Mark returned items
    order.items = order.items.map((item) => {
      if (items.includes(item.product.toString())) {
        return {
          ...item.toObject(),
          returnRequested: true,
        };
      }
      return item;
    });

    order.status = "Return Requested";
    order.statusHistory.push({ status: "Return Requested" });
    order.returnReason = reason;
    order.returnRequestedAt = new Date();

    await order.save();

    res.json({ message: "Return request submitted successfully" });
  } catch (err) {
    console.error("RETURN ERROR:", err);
    res.status(500).json({ message: "Failed to submit return request" });
  }
};


/* ================= REQUEST CANCELLATION ================= */
exports.requestCancellation = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Cannot request if already shipped/delivered/canceled
    if (
      ["Canceled", "Delivered", "Shipped"].includes(order.status)
    ) {
      return res.status(400).json({
        message: "Cancellation not allowed for this order",
      });
    }

    order.cancellationRequested = true;
    order.cancellationReason = reason;
    order.cancellationRequestedAt = new Date();

    order.status = "Cancellation Requested";
    order.statusHistory.push({ status: "Cancellation Requested" });

    await order.save();

    res.json({
      message: "Cancellation request submitted successfully",
    });
  } catch (err) {
    console.error("REQUEST CANCELLATION ERROR:", err);
    res.status(500).json({ message: "Request failed" });
  }
};
