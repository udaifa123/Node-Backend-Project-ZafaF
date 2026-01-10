const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/authMiddleware");
const { getAdminAnalytics } = require("../controllers/adminAnalyticsController");

router.get("/", protectAdmin, getAdminAnalytics);

module.exports = router;
