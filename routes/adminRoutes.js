const express = require("express");
const router = express.Router();

const { adminLogin } = require("../controllers/adminAuthController");
const {
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getRevenue,
} = require("../controllers/adminOrderController");

const { getAdminAnalytics } = require("../controllers/adminController");
const { protectAdmin } = require("../middleware/authMiddleware");
const { getReports } = require("../controllers/adminReportController");

// Admin login
router.post("/login", adminLogin);

// ✅ ANALYTICS (NEW & FIXED)
router.get("/analytics", protectAdmin, getAdminAnalytics);

// Orders management
router.get("/orders", protectAdmin, getOrders);
router.get("/orders/:id", protectAdmin, getOrderById);
router.put("/orders/:id/status", protectAdmin, updateOrderStatus);
router.delete("/orders/:id", protectAdmin, deleteOrder);

// Revenue
router.get("/revenue", protectAdmin, getRevenue);

router.get("/reports", protectAdmin, getReports);

router.get("/reports", protectAdmin, getReports);


module.exports = router;
