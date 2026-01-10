const express = require("express");
const router = express.Router();

const {
  addReview,
  getProductReviews,
  getAllReviews,
  deleteReview,
} = require("../controllers/reviewController");

const { protectUser } = require("../middleware/userAuth");
const { protectAdmin } = require("../middleware/adminAuth");

/* ================= ADMIN ROUTES (FIRST) ================= */

// GET all reviews (ADMIN)
router.get("/admin/all", protectAdmin, getAllReviews);

// DELETE review (ADMIN)
router.delete("/admin/:id", protectAdmin, deleteReview);

/* ================= USER ROUTES (AFTER) ================= */

// ADD review
router.post("/:productId", protectUser, addReview);

// GET product reviews
router.get("/:productId", getProductReviews);

module.exports = router;
