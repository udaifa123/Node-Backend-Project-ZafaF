const Order = require("../models/Order");

exports.getReports = async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $ne: "Canceled" },
      isDeleted: false,
    });

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.total || 0),
      0
    );

    res.json({
      success: true,
      reports: [
        {
          type: "Sales",
          totalOrders,
          totalRevenue,
        },
        {
          type: "Orders",
          totalOrders,
        },
        {
          type: "Revenue",
          totalRevenue,
        },
      ],
    });
  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate reports",
    });
  }
};
