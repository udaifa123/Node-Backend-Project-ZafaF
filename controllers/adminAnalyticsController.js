const User = require("../models/User");
const Order = require("../models/Order");

exports.getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalOrders = await Order.countDocuments({
      isDeleted: false,
    });

    const pendingOrders = await Order.countDocuments({
      status: "Processing",
      isDeleted: false,
    });

    const revenueData = await Order.aggregate([
      { $match: { status: { $ne: "Canceled" }, isDeleted: false } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    res.json({
      totalUsers,
      totalOrders,
      pendingOrders,
      totalRevenue,
    });
  } catch (err) {
    console.error("ADMIN ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Failed to load analytics" });
  }
};
