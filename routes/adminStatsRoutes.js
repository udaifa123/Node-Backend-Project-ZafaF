const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/authMiddleware");
const { getStats } = require("../controllers/adminStatsController");

router.get("/stats", protectAdmin, getStats);

module.exports = router;
