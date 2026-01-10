const Order = require("../models/Order");
const User = require("../models/User");

exports.getRevenueStats = async (req, res) => {
  try {
    const orders = await Order.find({ isDeleted: { $ne: true } });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    const totalOrders = orders.length;

    const totalCustomers = await User.countDocuments({
      isDeleted: { $ne: true },
    });

    const completedOrders = orders.filter(
      (o) => o.status === "Completed"
    ).length;

    const pendingOrders = orders.filter(
      (o) => o.status === "Processing"
    ).length;

    const cancelledOrders = orders.filter(
      (o) => o.status === "Cancelled"
    ).length;

    res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      orderStatus: {
        completed: completedOrders,
        pending: pendingOrders,
        cancelled: cancelledOrders,
      },
    });
  } catch (error) {
    console.error("Revenue error:", error);
    res.status(500).json({ message: "Revenue fetch failed" });
  }
};
