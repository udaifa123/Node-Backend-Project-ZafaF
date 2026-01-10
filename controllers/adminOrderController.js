const Order = require("../models/Order");
const User = require("../models/User");

/* ====================== GET ALL ORDERS ====================== */
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isDeleted: { $ne: true } })
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ====================== GET SINGLE ORDER ====================== */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name price");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    console.error("Get order by ID error:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

/* ====================== UPDATE ORDER STATUS ====================== */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

/* ====================== DELETE ORDER (SOFT DELETE) ====================== */
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isDeleted = true;
    await order.save();

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

/* ====================== GET REVENUE ====================== */
exports.getRevenue = async (req, res) => {
  try {
    // Fetch all orders (completed or all)
    const orders = await Order.find({ isDeleted: { $ne: true } })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Total orders
    const totalOrders = orders.length;

    // Total customers
    const totalCustomers = await User.countDocuments();

    // Recent 10 orders
    const recentOrders = orders.slice(0, 10).map(order => ({
      orderId: order._id,
      user: order.user?.name || "Guest",
      amount: order.total || 0,
      status: order.status || "pending",
      date: order.createdAt
    }));

    res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      recentOrders
    });
  } catch (error) {
    console.error("Revenue fetch failed:", error);
    res.status(500).json({ message: "Revenue fetch failed" });
  }
};