const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/authMiddleware");
const { getRevenueStats } = require("../controllers/adminRevenueController");

router.get("/revenue", protectAdmin, getRevenueStats);

module.exports = router;
