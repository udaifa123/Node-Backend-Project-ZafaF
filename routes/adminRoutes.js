const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

router.get("/stats", protect, adminOnly, getAdminStats);

module.exports = router;
