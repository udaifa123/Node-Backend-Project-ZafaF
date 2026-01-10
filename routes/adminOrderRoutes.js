const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/authMiddleware");

const {
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/adminOrderController");

router.get("/orders", protectAdmin, getOrders);
router.get("/orders/:id", protectAdmin, getOrderById);
router.put("/orders/:id/status", protectAdmin, updateOrderStatus);
router.delete("/orders/:id", protectAdmin, deleteOrder);

module.exports = router;
