const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

exports.getStats = async (req, res) => {
  try {
    // USERS
    const users = await User.countDocuments({ isBlocked: { $ne: true } });

    // ORDERS (Delivered only)
    const orders = await Order.find({ status: "Delivered", isDeleted: false });

    const totalOrders = orders.length;

    // REVENUE
    const revenue = orders.reduce(
      (sum, order) => sum + (order.totalPrice || order.total || 0),
      0
    );

    // PRODUCTS
    const products = await Product.countDocuments({ isDeleted: { $ne: true } });

    // AVG ORDER VALUE
    const avgOrderValue =
      totalOrders > 0 ? Math.round(revenue / totalOrders) : 0;

    res.json({
      users,
      orders: totalOrders,
      revenue,
      products,
      avgOrderValue,

      // optional (safe defaults)
      conversionRate: 0,
      activeSessions: 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
