const Review = require("../models/Review");

/* ================= USER ADD REVIEW ================= */
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.create({
      user: req.user._id,
      product: req.params.productId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Failed to add review" });
  }
};

/* ================= USER GET MY REVIEWS ================= */
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).populate(
      "product",
      "name"
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to get reviews" });
  }
};

/* ================= USER GET SINGLE REVIEW ================= */
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate(
      "product",
      "name"
    );

    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch review" });
  }
};

/* ================= USER UPDATE REVIEW ================= */
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;

    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: "Failed to update review" });
  }
};

/* ================= USER DELETE REVIEW ================= */
exports.deleteReviewUser = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review" });
  }
};

/* ================= GET ALL REVIEWS FOR A PRODUCT ================= */
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate(
      "user",
      "name"
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to get product reviews" });
  }
};

/* ================= ADMIN GET ALL REVIEWS ================= */
exports.getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

/* ================= ADMIN DELETE REVIEW ================= */
exports.deleteReviewAdmin = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review" });
  }
};
