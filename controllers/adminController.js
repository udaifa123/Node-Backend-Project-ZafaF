const Admin = require("../models/Admin");
const User = require("../models/User");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");

/* ================= ADMIN LOGIN ================= */
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADMIN STATS ================= */
exports.getAdminStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const orders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);

    const revenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.json({ users, orders, revenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET USERS ================= */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ORDERS ================= */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= REVENUE DASHBOARD ================= */
exports.getRevenue = async (req, res) => {
  try {
    const orders = await Order.find({ status: "completed" })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    const totalOrders = orders.length;
    const totalCustomers = await User.countDocuments();

    const recentOrders = orders.slice(0, 10).map(order => ({
      _id: order._id,
      user: order.user?.name || "Guest",
      amount: order.total,
      status: order.status,
      createdAt: order.createdAt
    }));

    res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      recentOrders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Revenue fetch failed" });
  }
};


/* ================= ADMIN ANALYTICS ================= */
/* ================= ADMIN ANALYTICS ================= */
exports.getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalOrders = await Order.countDocuments({ isDeleted: false });

    const pendingOrders = await Order.countDocuments({
      status: "Processing",
      isDeleted: false,
    });

    /* ✅ TOTAL REVENUE */
    const revenueAgg = await Order.aggregate([
      { $match: { status: "completed", isDeleted: false } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    /* ✅ MONTHLY REVENUE */
    const monthlyRevenue = await Order.aggregate([
      { $match: { status: "completed", isDeleted: false } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    /* ✅ ORDER STATUS */
    const orderStatus = await Order.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      monthlyRevenue,
      orderStatus,
    });
  } catch (err) {
    console.error("ADMIN ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Analytics failed" });
  }
};
