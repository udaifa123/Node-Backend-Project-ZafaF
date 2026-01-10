const express = require("express");
const router = express.Router();

const {
  addReview,
  getMyReviews,
  getReviewById,
  updateReview,
  deleteReviewUser,
  getProductReviews,
  getAllReviewsAdmin,
  deleteReviewAdmin,
} = require("../controllers/reviewController");

const { protectUser, protectAdmin } = require("../middleware/authMiddleware");

/* ================= USER ROUTES ================= */

// Add a review for a product
router.post("/:productId", protectUser, addReview);

// Get all reviews for the logged-in user
router.get("/my", protectUser, getMyReviews);

// Get a single review (edit)
router.get("/review/:id", protectUser, getReviewById);

// Update a review
router.put("/review/:id", protectUser, updateReview);

// Delete a review
router.delete("/review/:id", protectUser, deleteReviewUser);

// Get all reviews for a product (public)
router.get("/product/:productId", getProductReviews);

/* ================= ADMIN ROUTES ================= */

// Get all reviews (admin)
router.get("/admin/all", protectAdmin, getAllReviewsAdmin);

// Delete review (admin)
router.delete("/admin/:id", protectAdmin, deleteReviewAdmin);

module.exports = router;
